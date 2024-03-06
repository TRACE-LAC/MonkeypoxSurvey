import { Component, Input, OnInit } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-background-video-player',
  templateUrl: './background-video-player.component.html',
  styleUrls: ['./background-video-player.component.css']
})
export class BackgroundVideoPlayerComponent implements OnInit {

  @Input() animationPath: string;
  @Input() loop: boolean;

  basePath: string;
  constructor(private consts: ConstantsService) {
    this.basePath = "assets/animations/"
    this.animationPath = ""
    this.loop = false;
   }

  ngOnInit(): void {
  }

  /**
   * @description This function redirects to specific page
   */
  redirectPage(): void {
    if(this.animationPath.includes("cosex_intro")) {
      window.location.href = ConstantsService.BASE_PATH +  '/consentimiento';
    }
    
  }

}
