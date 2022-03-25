import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Travel } from '../models/travel.model';
import { TravelService } from '../services/travel.service';
import { UserService } from '../services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public p: number = 1;
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
  public today: Date = new Date();
  public month = (this.today.getMonth() +1 <10)? '0'+(this.today.getMonth()+1):this.today.getMonth()+1;
  public day = (this.today.getDate() <10)? '0'+this.today.getDate():this.today.getDate();
  public start = this.today.getFullYear().toString()+'-'+this.month+'-'+this.day;
  public title: string | null = null;

  public Travel: Travel;
  public compares: boolean = false;
  constructor(private readonly travelService: TravelService, private readonly userService: UserService,  private modalService: NgbModal) { }

  buildForm(): void {
    this.Form = new FormGroup({
      name: new FormControl(null, Validators.required),
      daily_budget: new FormControl(null, Validators.min(1)),
      start_date: new FormControl(this.start, Validators.required),
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
    this.error = false;
    this.buildForm();
  }

  addTravel(): void {
    if(this.Form.valid && this.destinations.length > 0) {
      this.error = false;
      let Travel: Travel = this.Form.value as Travel;
      Travel.destination = this.destinations;
      this.travelService.addTravelToUser(Travel).subscribe(result => {
        if(result.status){
          this.travels = [Travel, ...this.travels]
          //this.travels.push(Travel);
          this.add=!this.add;
          this.buildForm();
        } else {
          this.errorString= "Impossible to have two travels with the same name. Try again";
          this.error = true;
        }
      });
      this.destinations = [];
      this.indexDestination = [1];
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

  open(content, travel: Travel) {
    this.title = travel.name;
    this.Travel = travel;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  compare(): void {
    this.compares=true;
  }

  select(travel: Travel): void {
    this.selected = ! this.selected;
    this.Travel=travel;
  }

}
