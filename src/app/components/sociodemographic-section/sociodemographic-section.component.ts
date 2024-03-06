import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Answer } from 'src/app/model/answer';
import { SurveyAnswer } from 'src/app/model/survey-answer';
import { Child } from 'src/app/model/child';
import { Definition } from 'src/app/model/definition';
import { Deparment } from 'src/app/model/deparment';
import { Municipalitie } from 'src/app/model/municipalitie';
import { Question } from 'src/app/model/question';
import { ConstantsService } from 'src/app/services/constants.service';
import { GeographicalService } from 'src/app/services/geographical.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-sociodemographic-section',
  templateUrl: './sociodemographic-section.component.html',
  styleUrls: ['./sociodemographic-section.component.css']
})
export class SociodemographicSectionComponent implements OnInit {

  sectionForm: FormGroup;
  sectionName: string;
  questions: Question[];
  sectionQuestions: Question[];
  sectionDefinitions: Definition[];
  indexQuestions: number;
  iterationQuestions: number;
  departments: Deparment[];
  municipalities: Municipalitie[];
  showSpinner: boolean;
  departmentSelected: string;
  otherSelected: Answer;
  showTitle: boolean;
  showDefinitions: boolean;
  showThanks: boolean;
  radioText: any;
  isValidForm: boolean;
  animationPath: string;
  childQuestions: Map<number, Child>;

  beforeQuestionsLog: Map<number, number>;

  answersSurvey: SurveyAnswer[];

  whichQuestionsLog: Map<number, string>;
  isValidQuestionsLog: Map<number, boolean>;
  isValidStepForm: boolean;

  constructor(private consts: ConstantsService,
    private service: GeographicalService,
    private session: SessionStorageService,
    private fb: FormBuilder) {
    this.sectionForm = this.fb.group({});
    this.questions = [];
    this.sectionQuestions = [];
    this.sectionDefinitions = [];
    this.indexQuestions = 0;
    this.iterationQuestions = 3;
    this.sectionName = "A: Características sociodemográficas";
    this.departments = [];
    this.municipalities = [];
    this.showSpinner = false;
    this.departmentSelected = "";
    this.otherSelected = {} as Answer;
    this.showTitle = true;
    this.showDefinitions = true;
    this.showThanks = false;
    this.radioText = "";
    this.isValidForm = true;
    this.animationPath = "";
    this.childQuestions = new Map<number, Child>();

    this.beforeQuestionsLog = new Map<number, number>();
    this.beforeQuestionsLog.set(this.indexQuestions, this.iterationQuestions);

    this.whichQuestionsLog = new Map<number, string>();

    this.answersSurvey = [];

    this.isValidStepForm = true;

    this.isValidQuestionsLog = new Map<number, boolean>();

    this.defineAnimation();
    this.getDepartments();
    this.getQuestionsSection();
    this.getForm();
    this.defineWhichQuestions();
    this.setMunicipalities();
    this.setDefinitions();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getForm();
    this.defineWhichQuestions();
    this.setMunicipalities();
  }

  /**
   * @description This function defines the animation path according to the window width
   */
  defineAnimation(): void {
    if (window.innerWidth <= 600) {
      this.animationPath = "assets/animations/sociodemographic_section_ver.mp4";
    }
    else {
      this.animationPath = "assets/animations/sociodemographic_section.mp4";
    }
  }

  /**
  * @description This function sets the section definitions
  */
  setDefinitions(): void {
  }

  /**
  * @description This function gets the section questions 
  */
  getQuestionsSection(): void {
    this.consts.SURVEY_QUESTIONS = this.session.getSessionStorage(this.consts.DEFAULT_QUESTIONS);
    this.questions = this.consts.getSectionQuestionsWithAnswers(this.sectionName);
  }

  /**
   * @description This function defines the initial values to which answers
   */
  defineWhichQuestions(): void {
    this.whichQuestionsLog = new Map<number, string>();
    this.questions.forEach((question, index) => {
      let answers: Answer[] = this.toJson(question.answersInJson);
      answers.forEach(answer => {
        if (answer.text.includes('Cuál')) {
          let value = this.sectionForm.controls[question.id.toString()]!.get("which")!.value;
          if (value != undefined && value != '') {
            if (question.widgetType == 'checkbox' || question.widgetType == 'choicemix') {
              this.whichQuestionsLog.set(question.id, value);
            }
          }
          else {
            this.whichQuestionsLog.set(question.id, '');
          }
        }
      });
    });
  }

  /**
 * @description This function converts a string to JSON
 */
  toJson(data: string): any {
    return JSON.parse(data);
  }

  /**
   * @description This function get the form section
   */
  getForm(): void {
    this.sectionForm = new FormGroup(this.initializeForm());
    let valuesForm = this.session.getSessionStorage(this.consts.SOCIO_SECTION_FORM);
    if (valuesForm != undefined) {
      this.sectionForm.setValue(valuesForm);
    }
  }

  /**
   * @description This function initializes the form section
   */
  initializeForm(): any {
    const group: any = {};
    let isWhich: boolean = false;
    this.questions.forEach(question => {
      this.isValidQuestionsLog.set(question.id, true);
      let answers: Answer[] = this.toJson(question.answersInJson);
      if ((question.widgetType == 'checkbox' || question.widgetType == 'choice/anyone'
        || question.widgetType == 'choice' || question.widgetType == 'choicemix')
        && answers != null && answers != undefined && answers.length > 0) {
        const answerGroup: any = {};
        answers.forEach(answer => {
          if (question.widgetType != 'choice' && question.widgetType != 'choicemix') {
            answerGroup[answer.id.toString()] = new FormControl(question.widgetType == 'choice/anyone' ? 'Si' : '', Validators.required);
            if (answer.text.includes('Cuál')) {
              answerGroup['which'] = new FormControl('', Validators.required);
            }
          }
          else if (answer.text.includes('Cuál')) {
            answerGroup[question.id.toString()] = new FormControl('', Validators.required);
            answerGroup['which'] = new FormControl('', Validators.required);
            isWhich = true;
          }
        });
        if ((question.widgetType == 'choice' || question.widgetType == 'choicemix') && !isWhich) {
          group[question.id.toString()] = question.required ? answers != null && answers != undefined && answers.length > 0
            ? new FormControl('', Validators.required)
            : new FormControl('', Validators.required)
            : new FormControl('')
        }
        else {
          group[question.id.toString()] = new FormGroup(answerGroup);
        }
      }
      else {
        group[question.id.toString()] = question.required ? answers != null && answers != undefined && answers.length > 0
          ? new FormControl('', Validators.required)
          : new FormControl('', Validators.required)
          : new FormControl('')
      }
    });
    return group;
  }

  /**
   * @description This function sets a form control value
   */
  /**
   * @description This function sets a form control value
   */
  setFormValue(controlName: string, value: string, controlNameAnswer: string, controlNameChild: string, widgetType: string): void {
    if (widgetType == 'choice/anyone') {
      this.sectionForm.controls[controlName].get(controlNameAnswer)?.setValue(value);
    }
    else if (widgetType == 'choicemix') {
      this.sectionForm.controls[controlName].get(controlName)?.setValue(value);
    }
    else if (widgetType == 'input/choice/parent') {
      this.sectionForm.controls[controlName].get(controlNameAnswer)?.get(controlNameChild)?.setValue(value);
    }
    else {
      this.sectionForm.get(controlName)?.setValue(value);
    }
  }

  /**
   * @description This function validates a form field
   */
  validateForm(inputName: string): boolean {
    return this.sectionForm.get(inputName)?.touched
      && this.sectionForm.get(inputName)?.hasError('required') ? true : false;
  }

  /**
   * @description This function validates a form field
   */
  validateFullForm(): void {
    this.isValidForm = this.sectionForm.valid;
  }

  /**
   * @description This function validates the step form fields
   */
  validateStepForm(): void {
    this.isValidStepForm = true;
    for (let question of this.sectionQuestions) {
      let answers: Answer[] = this.toJson(question.answersInJson);
      if (question.parent != undefined && question.parent > 0 && !this.childQuestions.get(question.id)!.isParentSelected) {
        return;
      }
      if (question.widgetType == 'checkbox') {
        answers.forEach(answer => {
          let value = this.sectionForm.controls[question.id.toString()].get(answer.id.toString())?.value;
          if (value == undefined || value == '') {
            this.isValidQuestionsLog.set(question.id, false);
            this.isValidStepForm = false;
          }
          else {
            this.isValidQuestionsLog.set(question.id, true);
          }

          if (value == true && answer.text.toUpperCase().includes("Cuál")) {
            let value = this.sectionForm.controls[question.id.toString()].get("which")?.value;
            if (value == undefined || value == '') {
              this.isValidQuestionsLog.set(question.id, false);
              this.isValidStepForm = false;
            }
          }
          else {
            this.isValidQuestionsLog.set(question.id, true);
          }

        });
        if (!this.isValidStepForm) {

        }
      }
      if (question.widgetType == 'choice') {
        let value = this.sectionForm.get(question.id.toString())?.value;
        if (value == undefined || value == '') {
          this.isValidQuestionsLog.set(question.id, false);
          this.isValidStepForm = false;
          this.isValidQuestionsLog.set(question.id, false);
          this.isValidStepForm = false;
        }
        else {
          this.isValidQuestionsLog.set(question.id, true);
        }
      }
      if (question.widgetType == 'choicemix') {
        let mainValue = this.sectionForm.controls[question.id.toString()].get(question.id.toString())?.value;
        if (mainValue == undefined || mainValue == '') {
          this.isValidQuestionsLog.set(question.id, false);
          this.isValidStepForm = false;
        }
        else {
          this.isValidQuestionsLog.set(question.id, true);
        }

        answers.forEach(answer => {
          if (answer.text.includes("Cuál") && mainValue == answer.text) {
            let value = this.sectionForm.controls[question.id.toString()].get("which")?.value;
            if (value == undefined || value == '') {
              this.isValidQuestionsLog.set(question.id, false);
              this.isValidStepForm = false;
            }
          }
        });

        if (!this.isValidStepForm) {

        }

      }
      if (question.widgetType == 'input' || question.widgetType == 'dropdown') {
        let value = this.sectionForm.get(question.id.toString())?.value;
        if (value == undefined || value == '') {
          this.isValidQuestionsLog.set(question.id, false);
          this.isValidStepForm = false;
        }
        else {
          this.isValidQuestionsLog.set(question.id, true);
        }
      }
      if (question.widgetType == 'choice/anyone') {
        answers.forEach(answer => {
          let value = this.sectionForm.controls[question.id.toString()].get(answer.id.toString())?.value;
          if (value == undefined || value == '') {
            this.isValidQuestionsLog.set(question.id, false);
            this.isValidStepForm = false;
          }
          else {
            this.isValidQuestionsLog.set(question.id, true);
          }
        });
        if (!this.isValidStepForm) {

        }
      }
    }
  }

  /**
   * @description This function gets the Colombia's departments
   */
  getDepartments(): void {
    this.showSpinner = true;
    this.service.getDepartments().subscribe(
      (data) => {
        this.departments = data;
        this.showSpinner = false;
      },
      (error) => {
        console.error(error);
        this.showSpinner = false;
      }
    )
  }

  /**
  * @description This function gets the municipalities
  */
  getMunicipalities(inputName: string): void {
    this.showSpinner = true;
    this.departmentSelected = this.sectionForm.get(inputName)?.value;
    this.service.getMunicipalities(this.departmentSelected).subscribe(
      (data) => {
        this.municipalities = data;
        this.showSpinner = false;
      },
      (error) => {
        console.error(error);
        this.showSpinner = false;
      }
    )
  }

  /**
  * @description This function sets the municipalities
  */
  setMunicipalities(): void {
    let muniSession : Municipalitie [] = this.session.getSessionStorage(this.consts.MUNICIPALITIES);
    if(muniSession != undefined) {
      this.municipalities = muniSession;
    }
  }

  /**
   * @description This function actives onChange event of which input
   */
  onChangeWhich(event: any, controlName: string, controlNameAnswer: string): void {
    this.sectionForm.controls[controlName].get(controlNameAnswer)?.setValue(event.target.value);
  }

  /**
   * @description This function defines the question iteration
   */
  defineQuestionsIteration() {
    if (this.indexQuestions + 3 <= this.questions.length) {
      for (this.indexQuestions; this.indexQuestions < this.iterationQuestions; this.indexQuestions++) {
        this.sectionQuestions.push(this.questions[this.indexQuestions]);
      }
      this.iterationQuestions = this.indexQuestions + 3;
    }
    else if (this.indexQuestions + 2 <= this.questions.length) {
      this.iterationQuestions = this.indexQuestions + 2;
      for (this.indexQuestions; this.indexQuestions < this.iterationQuestions; this.indexQuestions++) {
        this.sectionQuestions.push(this.questions[this.indexQuestions]);
      }
    }
    else if (this.indexQuestions + 1 <= this.questions.length) {
      this.iterationQuestions = this.indexQuestions + 1;
      for (this.indexQuestions; this.indexQuestions < this.iterationQuestions; this.indexQuestions++) {
        this.sectionQuestions.push(this.questions[this.indexQuestions]);
      }
    }
  }

  /**
   * @description This function gets the previous questions
   */
  previousQuestion(): any {
    document.querySelector('.main-container')!.scrollTo(0, 0);
    this.sectionQuestions = [];
    let index: number = 0;

    let auxInit: number = 1;

    if (this.showTitle) {
      this.showSpinner = true;
      this.session.setSessionStorage(this.consts.SOCIO_SECTION_FORM, this.sectionForm.value);
      window.location.href = ConstantsService.BASE_PATH + '/instrucciones';
    }

    if (this.indexQuestions >= 3 && this.iterationQuestions <= 6) {
      this.showTitle = true;
      this.indexQuestions = 0;
      this.iterationQuestions = 3;
      return;
    }

    if (this.beforeQuestionsLog.size >= 2) {
      this.beforeQuestionsLog.delete(this.indexQuestions);
      auxInit = 2;
    }

    this.beforeQuestionsLog.forEach((value, key) => {
      if (index == this.beforeQuestionsLog.size - auxInit) {
        this.indexQuestions = key;
        this.iterationQuestions = value;
      }
      index++;
    }
    );
    this.defineQuestionsIteration();
  }

  /**
   * @description This function gets the next questions
   */
  nextQuestion(): any {
    document.querySelector('.main-container')!.scrollTo(0, 0);
    const form = document.forms.item(0);
    if (this.showTitle) {
      this.showTitle = false;
      if (this.showDefinitions && this.sectionDefinitions.length == 0) {
        this.showDefinitions = false;
      }
    }
    else if (this.showDefinitions) {
      this.showDefinitions = false;
    }
    if (this.indexQuestions == this.questions.length) {
      this.showSpinner = true;
      console.log(this.sectionForm);
      this.saveQuestions();
      window.location.href = ConstantsService.BASE_PATH + '/comportamiento';
    }

    this.validateStepForm();
    if (this.isValidStepForm) {
      this.sectionQuestions = [];
      this.beforeQuestionsLog.set(this.indexQuestions, this.iterationQuestions);
      this.defineQuestionsIteration();
    }
  }

  /**
   * @description This function sets the object to save the section question
   */
  saveQuestions(): void {
    this.answersSurvey = [];
    this.questions.forEach(question => {
      let answers: Answer[] = this.toJson(question.answersInJson);
      let answerSurvey: SurveyAnswer = {} as SurveyAnswer;
      if (question.parent != undefined && question.parent > 0 && !this.childQuestions.get(question.id)!.isParentSelected) {
        return;
      }
      if (question.widgetType == 'checkbox') {
        answers.forEach(answer => {
          let value = this.sectionForm.controls[question.id.toString()].get(answer.id.toString())?.value
          if (value != undefined && value != '' && !answer.text.includes("Cuál")) {
            if (value == true) {
              answerSurvey = {
                question_id: question.id,
                answer_id: answer.id,
                text: '',
                options: '',
                date: formatDate(formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 'yyyy-MM-dd', 'en_US')
              }
              this.answersSurvey.push(answerSurvey);
            }
          }
          else if (answer.text.includes("Cuál")) {
            let value = this.sectionForm.controls[question.id.toString()].get("which")?.value;
            if (value != undefined && value != '') {
              answerSurvey = {
                question_id: question.id,
                answer_id: answer.id,
                text: value,
                options: '',
                date: formatDate(formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 'yyyy-MM-dd', 'en_US')
              };
              this.answersSurvey.push(answerSurvey);
            }
          }
        });
      }
      if (question.widgetType == 'choice') {
        let value = this.sectionForm.get(question.id.toString())?.value;
        if (value != undefined && value != '') {
          answers.forEach(answer => {
            if (value == answer.text) {
              answerSurvey = {
                question_id: question.id,
                answer_id: answer.id,
                text: '',
                options: '',
                date: formatDate(formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 'yyyy-MM-dd', 'en_US')
              };
            }
          });
          this.answersSurvey.push(answerSurvey);
        }
      }
      if (question.widgetType == 'choicemix') {
        let value = this.sectionForm.controls[question.id.toString()].get(question.id.toString())?.value;
        if (value != undefined && value != '') {
          answers.forEach(answer => {
            if (value == answer.text && !answer.text.includes("Cuál")) {
              answerSurvey = {
                question_id: question.id,
                answer_id: answer.id,
                text: '',
                options: '',
                date: formatDate(formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 'yyyy-MM-dd', 'en_US')
              };
            }
            else if (value == answer.text && answer.text.includes("Cuál")) {
              let value = this.sectionForm.controls[question.id.toString()].get("which")?.value;
              if (value != undefined && value != '') {
                answerSurvey = {
                  question_id: question.id,
                  answer_id: answer.id,
                  text: value,
                  options: '',
                  date: formatDate(formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 'yyyy-MM-dd', 'en_US')
                };
              }
            }
          });
          this.answersSurvey.push(answerSurvey);
        }
      }
      if (question.widgetType == 'input' || question.widgetType == 'dropdown') {
        let value = this.sectionForm.get(question.id.toString())?.value;
        if (value != undefined && value != '') {
          answerSurvey = {
            question_id: question.id,
            answer_id: 0,
            text: value,
            options: '',
            date: formatDate(formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 'yyyy-MM-dd', 'en_US')
          };
          this.answersSurvey.push(answerSurvey);
        }
      }
      if (question.widgetType == 'choice/anyone') {
        answers.forEach(answer => {
          let value = this.sectionForm.controls[question.id.toString()].get(answer.id.toString())?.value;
          if (value != undefined && value != '') {
            answerSurvey = {
              question_id: question.id,
              answer_id: answer.id,
              text: value,
              options: value,
              date: formatDate(formatDate(new Date(), 'yyyy-MM-dd', 'en_US'), 'yyyy-MM-dd', 'en_US')
            };
            this.answersSurvey.push(answerSurvey);
          }
        });
      }
    });
    this.session.setSessionStorage(this.consts.SOCIO_SECTION_FORM, this.sectionForm.value);
    this.session.setSessionStorage(this.consts.SOCIO_SECTION_QUESTIONS, this.answersSurvey);
    this.session.setSessionStorage(this.consts.MUNICIPALITIES, this.municipalities);
    console.log(this.questions);
    console.log(this.sectionForm.value);
    console.log(this.answersSurvey);
  }

}
