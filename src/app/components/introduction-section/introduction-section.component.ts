import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-introduction-section',
  templateUrl: './introduction-section.component.html',
  styleUrls: ['./introduction-section.component.css']
})
export class IntroductionSectionComponent implements OnInit {

  animationPath: string;
  constructor(private session: SessionStorageService) {
    this.animationPath = "";
    this.defineAnimation();
   }

  ngOnInit(): void {
    this.session.clearAllSessionStorage();
    this.defineAnimation();
  }

  /**
   * @description This function defines the animation path according to the window width
   */
  defineAnimation(): void {
    if(window.innerWidth <= 600){
      this.animationPath = "assets/animations/cosex_intro_ver.mp4";
    }
    else {
      this.animationPath = "assets/animations/cosex_intro.mp4";
    }
  }
}
