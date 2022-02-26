import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-travel-page',
  templateUrl: './travel-page.component.html',
  styleUrls: ['./travel-page.component.css']
})
export class TravelPageComponent implements OnInit {
  public days: string[] = ['Day One', 'Day Two', 'Day Three'];
  

  constructor() { }

  ngOnInit(): void {
  }


}
