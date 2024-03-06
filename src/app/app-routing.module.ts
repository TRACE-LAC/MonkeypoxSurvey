import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SociodemographicSectionComponent } from './components/sociodemographic-section/sociodemographic-section.component';
import { IntroductionSectionComponent } from './components/introduction-section/introduction-section.component';
import { InformedConsentSectionComponent } from './components/informed-consent-section/informed-consent-section.component';
import { SexualBehaviorSectionComponent } from './components/sexual-behavior-section/sexual-behavior-section.component';
import { RiskAttitudesPerceptionsSectionComponent } from './components/risk-attitudes-perceptions-section/risk-attitudes-perceptions-section.component';
import { InstructionSectionComponent } from './components/instruction-section/instruction-section.component';

const routes: Routes =  [
  { path: '', component: IntroductionSectionComponent },
  { path: 'consentimiento', component: InformedConsentSectionComponent },
  { path: 'instrucciones', component: InstructionSectionComponent },
  { path: 'sociodemografico', component: SociodemographicSectionComponent },
  { path: 'comportamiento', component: SexualBehaviorSectionComponent },
  { path: 'percepciones', component: RiskAttitudesPerceptionsSectionComponent },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
