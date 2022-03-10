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
  public selected: boolean = false;
  public token: string;
  public month = ((new Date().getMonth()+1) < 10)? '0'+((new Date().getMonth()+1)):((new Date().getMonth()+1));
  public day = ((new Date().getDate()) < 10)? '0'+((new Date().getDate())):((new Date().getDate())); 
  public today: string = (new Date()).getFullYear()+'-'+this.month+'-'+this.day;

  public Travel: Travel;
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
      Travel.user=this.token;
      this.travelService.addTravelToUser(this.Form.value as Travel).subscribe(result => {
        if(result.status){
          this.travels.push(Travel);
          this.add=!this.add;
        } else {
          this.errorString= "Impossible to have two travels with the same name. Try again";
          this.error = true;
        }
      });
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
    if(this.destinations.length == this.indexDestination.length) {
      this.destinations.pop();
    }
    this.indexDestination.pop();
  }

  deleteTravel(travel: Travel): void {
    this.travelService.deleteTravel({name: travel.name, token: this.token}).subscribe(result => {
      if(result.status){
        this.travels.splice(this.travels.indexOf(travel),1);
        this.displayStyle="none";
      }
    });
  }

  openPopUp(travel: Travel): void {
    this.displayStyle="block";
    this.Travel = travel;
  }

  closePopUp(): void {
    this.displayStyle="none";
  }

  compare(): void {
    this.compares=true;
  }

  select(travel: Travel): void {
    this.selected = ! this.selected;
    this.Travel=travel;
  }

}
