import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Travel, travels } from '../travels';

@Component({
  selector: 'app-travel-page',
  templateUrl: './travel-page.component.html',
  styleUrls: ['./travel-page.component.css']
})
export class TravelPageComponent implements OnInit {
  public days: string[] = ['Day One', 'Day Two', 'Day Three'];
  
  travel: Travel | undefined;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  // get the travel name from the current route.
  const routeParams = this.route.snapshot.paramMap;
  const travelNameFromRoute = String(routeParams.get('travelName'));

  // Find the product that correspond with the id provided in route.
  this.travel = travels.find(travel => travel.name === travelNameFromRoute);
  
  }


}
