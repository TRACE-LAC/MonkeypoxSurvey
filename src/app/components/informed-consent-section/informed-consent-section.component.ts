import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from 'src/app/model/question';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { QuestionService } from 'src/app/services/question.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-informed-consent-section',
  templateUrl: './informed-consent-section.component.html',
  styleUrls: ['./informed-consent-section.component.css']
})
export class InformedConsentSectionComponent implements OnInit {
  
  showSpinner: boolean;
  sectionName: string;
  questions: Question[];
  sectionForm : FormGroup;
  isValidForm : boolean;
  animationPath: string;

  constructor(private consts: ConstantsService, 
    private authService: AuthenticationService,
    private service: QuestionService, 
    private session: SessionStorageService, 
    private fb: FormBuilder) { 
      this.showSpinner = false;
      this.sectionName = "Consentimiento informado";
      this.questions = [];
      this.sectionForm = this.fb.group({});
      this.isValidForm = true;
      this.animationPath = "";
      this.defineAnimation();
    }

  ngOnInit(): void {
    this.defineAnimation();
    this.authenticate();
  }

  /**
   * @description This function defines the animation path according to the window width
   */
  defineAnimation(): void {
    console.log(window.innerWidth);
    if(window.innerWidth <= 600){
      this.animationPath = "assets/animations/sociodemographic_section_ver.mp4";
    }
    else {
      this.animationPath = "assets/animations/sociodemographic_section.mp4";
    }
  }

  /**
   * @description This function gets the authentication token
   */
  authenticate(): void {
    this.showSpinner = true;
    this.authService.postAuthenticate().subscribe(
      (data) => {
        this.session.setSessionStorage(this.consts.DEFAULT_TOKEN, data);
        this.getQuestionsSection();
      },
      (error) => {
        console.error(error);
        this.showSpinner = false;
      }
    )
  }
  
  /**
   * @description This function gets the section questions 
   */
  getQuestionsSection(): void {
    this.showSpinner = true;
    this.consts.SURVEY_QUESTIONS = [];
    this.service.getQuestionsAnswers().subscribe(
      (data) => {
        this.showSpinner = false;
        this.consts.SURVEY_QUESTIONS = data;
        this.questions = this.consts.getSectionQuestionsWithAnswers(this.sectionName);
        this.session.setSessionStorage(this.consts.DEFAULT_QUESTIONS, this.consts.SURVEY_QUESTIONS);
        this.sectionForm = new FormGroup(this.initializeForm());    
      },
      (error) => {
        this.showSpinner = false;
        console.error(error);
      }
    );
  }

  /**
   * @description This function converts a string to JSON
   */
  toJson(data: string): any {
    return JSON.parse(data);
  } 

  /**
   * @description This function initializes a form 
   */
  initializeForm() : any {
    const group: any = {};
    this.questions.forEach(question => {
      let answers = this.toJson(question.answersInJson);
      group[question.id.toString()] = !question.required ? answers != null && answers != undefined && answers.length > 0
        ?  new FormControl('', Validators.required) 
        : new FormControl('', Validators.required) 
      : new FormControl('')
    });
    return group;
  }

  /**
   * @description This function sets a form control value
   */
  setFormValue(controlName: string, value: string) : void {
    this.sectionForm.get(controlName)?.setValue(value);
  }

  /**
   * @description This function validates a form field
   */
  validateForm(inputName: string): boolean {
    return this.sectionForm.get(inputName)?.touched 
    && this.sectionForm.get(inputName)?.hasError('required') ? true : false;
  }

  /**
   * @description This function validates if the consent was accepted by the user
   */
  validateAcceptConsent() : void {
    this.isValidForm = true;
    this.questions.forEach(question => {
      let value = this.sectionForm.get(question.id.toString())?.value;
        if(value == undefined || value == '' || value == 'No') {
            this.isValidForm = false;
        }
    });
  }
  
  /**
   * @description This function assigns the value of a radio button
   */
  assignValueRadioBtn(inputName: string, selectedValue: string){
    this.sectionForm.get(inputName)?.setValue(selectedValue === "Si" ? true : false);
  }

  /**
   * @description This function gets the next questions
   */
  nextSection(): void {
    this.showSpinner = true;
    this.validateAcceptConsent();
    if(this.isValidForm) {
      window.location.href = ConstantsService.BASE_PATH +  '/instrucciones';
    }
    else {
      this.showSpinner = false;
    }
  }

}
