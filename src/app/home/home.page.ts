import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';

export const aisles = [
  'Frozen','Cold Box','Soup Bar','Cookie', 'Perimeter',
  'Baby','Drinks','Baking','International',
  'Chips','Bulk','Register', 'Other'
];

interface Cw {
  aisle: typeof aisles[number];
  start: Date;
  stop: Date;
  count: number|0;
};

const tm = (t) => {
  const m = t.split(":");
  return m[0]*60+(+m[1])
}

const td = () => {
  return ((new Date()).toISOString().split('T'))[0];
}

const wl = window.localStorage;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  as:string[] = aisles;
  dates: any;
  cList:Cw[]= [
    <Cw>{}
  ];

  constructor(
    public alert: AlertController
  ) {
    this.init().then().catch();
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive)
        return
      this.persist().then().catch();
    });
  }

  async init() {
    const d = td().split("-");
    this.dates = JSON.parse(wl.getItem(`${d[0]}${d[1]}`));
    // await this.show(JSON.stringify(this.dates));
    this.cList = this.dates[td()];
  }

  async persist() {
    const d = td().split("-");
    const u = {[td()]: this.cList};
    
    this.dates = (this.dates)?{...this.dates,...u}:u;
    const ds = JSON.stringify(this.dates);
    
    wl.setItem(`${d[0]}${d[1]}`, ds);
    // return await this.show(wl.getItem(`${d[0]}${d[1]}`));
  }

  async refresh(){
    await this.persist();
    window.location.reload();
  }

  add() {
    this.cList.push(<Cw>{});
  }

  setTime(prop) {
    console.log(prop);
    if(prop!=null||undefined)
      return prop
    return (new Date().toLocaleTimeString('en-GB')).slice(0, -3);
  }

  et(c) {
    if(!c.start||!c.stop)
      return 0
      const t = tm(c.stop)-tm(c.start)
    return (t<0)?+t+1440:t
  }

  cph(c) {
    if(!c.start||!c.stop||!c.count)
      return 0
    const t = (+this.et(c)/60)
    return Math.round(c.count/((t<0.01)?1:t))
  }

  set() {
    let t = 0;
    for(let c of this.cList) {
      t = +this.et(c)+t
    }
    return t
  }

  scph() {
    let ct = 0;
    for(let c of this.cList) {
      ct = +(c.count||0)+ct
    }
    const t = (+this.set()/60)
    return Math.round(ct/((t<0.01)?1:t))
  }

  async show(m) {
    console.log(m);
    const a = await this.alert.create({
      message: m,
      buttons: [{
        text: 'Ok',
        role: 'dismiss'
      }]
    });
    await a.present();
  }

}
