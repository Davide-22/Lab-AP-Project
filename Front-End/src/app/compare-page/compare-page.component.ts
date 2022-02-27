import { CompileMetadataResolver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {compares} from '../compares';
import { travels } from '../travels';

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent implements OnInit {

  public compares: string[] = compares;
  public travels = travels;

  constructor() { }

  ngOnInit(): void {
  }

}
