import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Email } from '../models/email.model';
import { Travel } from '../models/travel.model';
import { TravelService } from '../services/travel.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public Form: FormGroup;
  public destinations: string[] = [];
  public indexDestination: number[] = [1];
  public displayStyle: any = "none";
  public add: boolean = false;
  public travels: Travel[] = [];

  public travel: string;
  public compares: boolean = false;
  constructor(private readonly travelService: TravelService) { }

  buildForm(): void {
    this.Form = new FormGroup({
      name: new FormControl(null),
      daily_budget: new FormControl(null),
      start_date: new FormControl(null),
      description: new FormControl(null),
      end_date: new FormControl(null),
      user: new FormControl('servillostefano@gmail.com')
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.travelService.getTravelsByUser({email: 'servillostefano@gmail.com'}).subscribe(result => this.travels = result);
  }

  cancel(): void {
    this.add = !this.add;
    this.destinations = [];
    this.indexDestination = [1];
  }

  addTravel(): void {
    let Travel: Travel = this.Form.value as Travel;
    Travel.destination = this.destinations;
    console.log(this.Form.value);
    this.travelService.addTravelToUser(this.Form.value as Travel).subscribe(result => console.log(result));
    this.add = !this.add;
    this.travelService.getTravelsByUser({email: 'servillostefano@gmail.com'}).subscribe(result => this.travels = result);
  }

  plus(): void {
    this.indexDestination.push(1);
  }

  minus(): void {
    this.indexDestination.pop();
  }

  deleteTravel(): void {
    this.displayStyle="none";
  }

  openPopUp(name: string): void {
    this.displayStyle="block";
    this.travel = name;

  }

  closePopUp(): void {
    this.displayStyle="none";
  }

  compare(): void {
    this.compares=true;
  }

}
