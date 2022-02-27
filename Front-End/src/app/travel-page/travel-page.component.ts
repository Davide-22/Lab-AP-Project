import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Travel, travels } from '../travels';
import { days } from '../days';

@Component({
  selector: 'app-travel-page',
  templateUrl: './travel-page.component.html',
  styleUrls: ['./travel-page.component.css']
})
export class TravelPageComponent implements OnInit {
  //public days: string[] = ['Day One', 'Day Two', 'Day Three'];
  days = days;

  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  travel: Travel | undefined;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  
    this.buildForm();
    // get the travel name from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const travelNameFromRoute = String(routeParams.get('travelName'));

    // Find the product that correspond with the id provided in route.
    this.travel = travels.find(travel => travel.name === travelNameFromRoute);
  
  }

  buildForm(): void {
    this.Form = new FormGroup({
      ExpenseName: new FormControl(null),
      ExpenseAmount: new FormControl(null),
      ExpenseCategory: new FormControl(null),
      ExpensePlace: new FormControl(null)
    });
  }

  form(): void {
    this.add = !this.add;
  }

  addExpense(): void {
    //chiamata back-end
    this.add = !this.add;
  }

  openPopUp(): void {
    this.displayStyle="block";
  }

  closePopUp(): void {
    this.displayStyle="none";
  }

  completeTravel(): void {
    window.location.href = "/main-page";
  }

}
