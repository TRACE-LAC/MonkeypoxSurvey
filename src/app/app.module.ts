import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BackgroundVideoPlayerComponent } from './shared/background-video-player/background-video-player.component';
import { SurveySectionComponent } from './shared/survey-section/survey-section.component';
import { SociodemographicSectionComponent } from './components/sociodemographic-section/sociodemographic-section.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { IntroductionSectionComponent } from './components/introduction-section/introduction-section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InformedConsentSectionComponent } from './components/informed-consent-section/informed-consent-section.component';
import { APP_BASE_HREF } from '@angular/common';
import { ConstantsService } from './services/constants.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SexualBehaviorSectionComponent } from './components/sexual-behavior-section/sexual-behavior-section.component';
import { RiskAttitudesPerceptionsSectionComponent } from './components/risk-attitudes-perceptions-section/risk-attitudes-perceptions-section.component';
import { InstructionSectionComponent } from './components/instruction-section/instruction-section.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundVideoPlayerComponent,
    SurveySectionComponent,
    SociodemographicSectionComponent,
    SpinnerComponent,
    IntroductionSectionComponent,
    InformedConsentSectionComponent,
    SexualBehaviorSectionComponent,
    RiskAttitudesPerceptionsSectionComponent,
    InstructionSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: APP_BASE_HREF, 
      useValue: ConstantsService.BASE_PATH
    }
  ],
  //entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
