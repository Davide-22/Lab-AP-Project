import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Travel } from '../models/travel.model';
import { TravelService } from '../services/travel.service';
import { UserService } from '../services/user.service';

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
  public error: boolean = false;
  public errorString: string='You must fill all the field';
  public email: string;
  public selected: boolean = false;
  public token: string;

  public travel: string;
  public daily_budget: number;
  public compares: boolean = false;
  constructor(private readonly travelService: TravelService, private readonly userService: UserService) { }

  buildForm(): void {
    this.Form = new FormGroup({
      name: new FormControl(null, Validators.required),
      daily_budget: new FormControl(null, Validators.min(1)),
      start_date: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      end_date: new FormControl(null),
      user_token: new FormControl(this.token)
    });
  }

  ngOnInit(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.token = token;
    this.userService.verifyCookie({token: token}).subscribe(result => {
      if(result.status == false) {
        window.location.href="";
      } else {
        this.travelService.getTravelsByUser({token: this.token}).subscribe(result => this.travels = result);
      }
    })
    this.buildForm();
  }

  cancel(): void {
    this.add = !this.add;
    this.destinations = [];
    this.indexDestination = [1];
  }

  addTravel(): void {
    if(this.Form.valid && this.destinations.length > 0) {
      this.error = false;
      let Travel: Travel = this.Form.value as Travel;
      Travel.destination = this.destinations;
      this.travelService.addTravelToUser(this.Form.value as Travel).subscribe(result => console.log(result));
      this.add = !this.add;
      window.location.href="/main-page";
    } else if (this.destinations.length == 0) {
      this.errorString = "Enter at least one destination";
      this.error = true;
    } else if (this.Form.get('daily_budget').value < 1) {
      this.errorString = 'Enter a daily budget >= 1';
      this.error = true;
    } else {
      this.errorString = 'You must fill all the field';
      this.error = true;
    }
  }

  plus(): void {
    this.indexDestination.push(1);
  }

  minus(): void {
    this.indexDestination.pop();
  }

  deleteTravel(name: string): void {
    this.travelService.deleteTravel({name: name, token: this.token}).subscribe(result => console.log(result));
    this.displayStyle="none";
    window.location.href="/main-page";
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

  select(name: string, budget: number): void {
    this.selected = ! this.selected;
    this.travel = name;
    this.daily_budget = budget;
  }

}
