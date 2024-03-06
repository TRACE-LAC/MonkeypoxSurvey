import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-survey-section',
  templateUrl: './survey-section.component.html',
  styleUrls: ['./survey-section.component.css']
})
export class SurveySectionComponent implements OnInit {

   title: string;
   titleMarginTop: number;
   titleMarginLeft: number;
   tooltipButton: string;
   @ViewChild("body") body: ElementRef<any>;
   nextSection: Function;
   nextButton: boolean;
   backButton: boolean;
   tooltipBackButton: string;

  constructor() {
    this.title = '';
    this.titleMarginLeft = 0.0;
    this.titleMarginTop = 0.0;
    this.tooltipBackButton ='';
    this.tooltipButton = '';
    this.nextButton = false;
    this.backButton = false;
    this.body = {} as ElementRef;
    this.nextSection = function(){};
   }

  ngOnInit(): void {
  }

}
