import { CompileMetadataResolver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import {compares} from '../compares';

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent implements OnInit {

  public compares: string[] = compares;
  @Input() public travels;

  constructor() { }

  ngOnInit(): void {
  }

}
