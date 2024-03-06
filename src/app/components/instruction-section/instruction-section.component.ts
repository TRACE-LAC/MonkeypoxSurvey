import { Component, OnInit } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-instruction-section',
  templateUrl: './instruction-section.component.html',
  styleUrls: ['./instruction-section.component.css']
})
export class InstructionSectionComponent implements OnInit {

  showSpinner: boolean;
  animationPath: string;
  

  constructor() { 
    this.showSpinner = false;
    this.animationPath = '';
  }

  ngOnInit(): void {
    this.defineAnimation();
  }

  /**
   * @description This function defines the animation path according to the window width
   */
  defineAnimation(): void {
    console.log("HOLAA")
    console.log(window.innerWidth)
    if(window.innerWidth <= 600){
      this.animationPath = "assets/animations/sociodemographic_section_ver.mp4";
    }
    else {
      this.animationPath = "assets/animations/sociodemographic_section.mp4";
    }
  }

  /**
   * @description This function gets the previous section
   */
  previousSection(): any {
    this.showSpinner = true;
    window.location.href = ConstantsService.BASE_PATH +  '/consentimiento';
  }

  /**
   * @description This function gets the next section
   */
  nextSection(): void {
    this.showSpinner = true;
    window.location.href = ConstantsService.BASE_PATH +  '/sociodemografico';
  }

}
