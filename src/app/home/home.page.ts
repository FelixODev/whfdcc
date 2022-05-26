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

  refresh(){
    window.location.reload();
  }

}
