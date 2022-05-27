import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

export const aisles = [
  'Frozen','Cold Box','Soup Bar','Cookie',
  'Detergent','Drinks','Baking','International',
  'Chips','Bulk','Register'
];

interface Ca {
  aisle: typeof aisles[number];
  start: Date;
  stop: Date;
  count: number|0;
};

interface Cw {
  date?: string;
  aisles?: Ca[];
}

const tm = (t) => {
  const m = t.split(":");
  return m[0]*60+(+m[1])
}

const dt = () => {
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
  dates: any = {[dt()]:true};
  cWork:Cw = <Cw>{date:dt(),aisles:<Ca[]>[]};
  cList:Ca[]= [
    <Ca>{}
  ];

  constructor(
    public alert: AlertController
  ) {
    this.init().then().catch()
  }

  async init() {
    this.dates = JSON.parse(wl.getItem('dates'));
    const cw = wl.getItem(dt());
    if(cw){
      this.cWork = JSON.parse(cw);
      this.cList = this.cWork.aisles;
    }
  }

  async refresh(){
    await this.deInit();
    window.location.reload();
  }

  async deInit() {
    const u = {[this.cWork.date]: true};
    this.dates = (this.dates)?{...this.dates,...u}:u;
    wl.setItem('dates', JSON.stringify(this.dates));
    this.cWork.aisles = this.cList;
    wl.setItem(this.cWork.date,
      JSON.stringify(
        this.cWork
      )
    );
  }

  add() {
    this.cList.push(<Ca>{});
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
