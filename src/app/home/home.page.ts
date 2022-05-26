import { Component } from '@angular/core';

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

const tm = (t) => {
  const m = t.split(":");
  return m[0]*60+(+m[1])
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  as:string[] = aisles;
  cList:Ca[]= [
    <Ca>{}
  ];

  constructor() {}

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
    return (t>0)?t:+t+1440
  }

  cph(c) {
    if(!c.start||!c.stop||!c.count)
      return 0
    return c.count
    // /(+this.et(c)/60)
  }

  refresh(){
    window.location.reload();
  }

}
