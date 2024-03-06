import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Answer } from 'src/app/model/answer';
import { SurveyAnswer } from 'src/app/model/survey-answer';
import { Child } from 'src/app/model/child';
import { Definition } from 'src/app/model/definition';
import { Question } from 'src/app/model/question';
import { ConstantsService } from 'src/app/services/constants.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { QuestionService } from 'src/app/services/question.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-risk-attitudes-perceptions-section',
  templateUrl: './risk-attitudes-perceptions-section.component.html',
  styleUrls: ['./risk-attitudes-perceptions-section.component.css']
})
export class RiskAttitudesPerceptionsSectionComponent implements OnInit {

  sectionForm: FormGroup;
  sectionName: string;
  sectionDefinitions: Definition[];
  questions: Question[];
  sectionQuestions: Question[];
  indexQuestions: number;
  iterationQuestions: number;
  showSpinner: boolean;
  departmentSelected: string;
  otherSelected: Answer;
  showTitle: boolean;
  showDefinitions: boolean;
  showThanks: boolean;
  animationPath: string;
  childQuestions: Map<number, Child>;
  beforeQuestionsLog: Map<number, number>;
  whichQuestionsLog: Map<number, string>;

  answersSurvey: SurveyAnswer[];

  @ViewChild('which') which: ElementRef<any>;

  isValidQuestionsLog: Map<number, boolean>;
  isValidStepForm: boolean;

  constructor(private consts: ConstantsService,
    private session: SessionStorageService,
    private service: QuestionService,
    private fb: FormBuilder) {
    this.sectionForm = this.fb.group({});
    this.questions = [];
    this.sectionQuestions = [];
    this.indexQuestions = 0;
    this.iterationQuestions = 2;
    this.sectionName = "C: Conocimiento, percepción de riesgo y actitudes frente a la viruela símica y la implementación de medidas de prevención";
    this.sectionDefinitions = [];
    this.showSpinner = false;
    this.departmentSelected = "";
    this.otherSelected = {} as Answer;
    this.showTitle = true;
    this.showDefinitions = true;
    this.showThanks = false;
    this.animationPath = "";

    this.which = {} as ElementRef;

    this.childQuestions = new Map<number, Child>();

    this.beforeQuestionsLog = new Map<number, number>();

    this.whichQuestionsLog = new Map<number, string>();

    this.answersSurvey = [];

    this.isValidStepForm = true;

    this.isValidQuestionsLog = new Map<number, boolean>();

    this.defineAnimation();
    this.getQuestionsSection();
    this.getForm();
    this.defineWhichQuestions();
    this.defineChildQuestion();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getForm();
    this.defineWhichQuestions();
    this.defineChildQuestion();
  }

  /**
   * @description This function defines the animation path according to the window width
   */
  defineAnimation(): void {
    if (window.innerWidth <= 600) {
      this.animationPath = "assets/animations/risk_attitudes_perceptions_section_ver.mp4";
    }
    else {
      this.animationPath = "assets/animations/risk_attitudes_perceptions_section.mp4";
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
  * @description This function defines the questions children
  */
  defineChildQuestion(): void {
    this.childQuestions = new Map<number, Child>();
    this.questions.forEach(question => {
      if (question.parent > 0) {
        let valueExpected: string = question.text.toLowerCase();
        let child: Child = {
          id: question.id,
          parentId: question.parent,
          parentValue: valueExpected,
          valueExpected: valueExpected,
          isParentSelected: false
        }
        if (valueExpected.includes('"si"') || valueExpected.includes('"sí"') || valueExpected.includes('afirmativo')) {
          valueExpected = 'si';
          child.valueExpected = valueExpected;
        }
        else if (valueExpected.includes('"no"')) {
          valueExpected = 'no';
          child.isParentSelected = false;
          child.valueExpected = valueExpected;
        }
        if (question.widgetType == 'choice') {
          let value = this.sectionForm.get(question.parent.toString())?.value;
          if (value != undefined && value != '') {
            if (child.valueExpected == value.toLowerCase()) {
              child.isParentSelected = true;
            }
          }
        }
        this.childQuestions.set(question.id, child);
      }
    });
  }

  /**
  * @description This function gets the questions children length
  */
  getLengthChildren(parentId: number): number {
    let length: number = 0;
    this.childQuestions.forEach(child => {
      if (child.parentId == parentId) {
        length++;
      }
    });
    return length;
  }

  /**
  * @description This function updates the questions children values
  */
  updateChildren(parentId: string, value: string): void {
    this.beforeQuestionsLog.delete(this.indexQuestions);
    this.questions.forEach((question, index) => {
      if (question.parent == parseInt(parentId)) {
        let child = this.childQuestions.get(question.id);
        child!.parentValue = value.toLowerCase();
        if (child?.valueExpected == value.toLowerCase()) {
          child.isParentSelected = true;
        }
        else {
          child!.isParentSelected = false;
        }
      }
    });
    let countOutParents = 1;
    this.sectionQuestions.forEach(question => {
      if (question.parent != undefined && question.parent <= 0) {
        countOutParents++;
      }
    })
    if (countOutParents <= 2 && this.indexQuestions + 1 <= this.questions.length) {
      this.sectionQuestions.push(this.questions[this.indexQuestions]);
      let length: number = this.getLengthChildren(this.questions[this.indexQuestions].id);
      this.indexQuestions++;

      if (length > 0) {
        this.iterationQuestions += length;
        for (this.indexQuestions; this.indexQuestions < this.iterationQuestions; this.indexQuestions++) {
          this.sectionQuestions.push(this.questions[this.indexQuestions]);
        }
      }
      this.iterationQuestions = this.indexQuestions + 1;
    }

    this.beforeQuestionsLog.set(this.indexQuestions, this.iterationQuestions);
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
    let valuesForm = this.session.getSessionStorage(this.consts.PERCEPTIONS_SECTION_FORM);
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
    this.questions.forEach((question, index) => {
      this.isValidQuestionsLog.set(question.id, true);
      isWhich = false;
      let answers: Answer[] = this.toJson(question.answersInJson);
      if ((question.widgetType == 'checkbox' || question.widgetType == 'choice/anyone'
        || question.widgetType == 'choice' || question.widgetType == 'choicemix')
        && answers != null && answers != undefined && answers.length > 0) {
        const answerGroup: any = {};
        answers.forEach(answer => {
          if (question.widgetType != 'choice' && question.widgetType != 'choicemix') {
            if (question.widgetType == 'checkbox') {
              answerGroup[answer.id.toString()] = new FormControl('');
            }
            else {
              answerGroup[answer.id.toString()] = new FormControl('');
            }
            if (answer.text.includes('Cuál')) {
              answerGroup['which'] = new FormControl('');
            }
          }
          else if (answer.text.includes('Cuál')) {
            answerGroup[question.id.toString()] = new FormControl('', question.required ? Validators.required : null);
            answerGroup['which'] = new FormControl('', Validators.required);
            isWhich = true;
          }
        });
        if ((question.widgetType == 'choice' || question.widgetType == 'choicemix') && !isWhich) {
          group[question.id.toString()] = question.required ? answers != null && answers != undefined && answers.length > 0
            ? new FormControl('', question.required ? Validators.required : null)
            : new FormControl('', question.required ? Validators.required : null)
            : new FormControl('')
        }
        else {
          group[question.id.toString()] = new FormGroup(answerGroup);
        }
      }
      else if (question.widgetType == 'input/choice') {
        const answerGroup: any = {};
        answerGroup[question.id.toString()] = new FormControl('', question.required ? Validators.required : null);
        answerGroup['input'] = new FormControl('', Validators.required);
        group[question.id.toString()] = new FormGroup(answerGroup);
        return;
      }
      else {
        group[question.id.toString()] = question.required ? answers != null && answers != undefined && answers.length > 0
          ? new FormControl('', Validators.required)
          : new FormControl(question.text != 'En caso afirmativo ¿Considera que la fuente de contagio pudo haber sido uno de sus contactos sexuales?' ? '' : 'Si', Validators.required)
          : new FormControl(question.text != 'En caso afirmativo ¿Considera que la fuente de contagio pudo haber sido uno de sus contactos sexuales?' ? '' : 'Si')
      }
    });
    return group;
  }

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
      this.sectionForm.controls[controlName]?.get(controlNameChild)?.setValue(value);
    }
    else {
      this.sectionForm.get(controlName)?.setValue(value);
      if (this.getLengthChildren(parseInt(controlName)) > 0) {
        this.updateChildren(controlName, value);
      }
    }

  }

  /**
   * @description This function validates a form field
   */
  validateForm(controlName: string, controlNameAnswer: string, controlNameChild: string, widgetType: string): boolean {
    if (widgetType == 'choice/anyone') {
      return this.sectionForm.controls[controlName].get(controlNameAnswer)?.touched
        && this.sectionForm.controls[controlName].get(controlNameAnswer)?.hasError('required') ? true : false;
    }
    else if (widgetType == 'choicemix') {
      return this.sectionForm.controls[controlName].get(controlName)?.touched
        && this.sectionForm.controls[controlName].get(controlName)?.hasError('required') ? true : false;
    }
    else if (widgetType == 'input/choice/parent') {
      return this.sectionForm.controls[controlName].get(controlNameAnswer)?.get(controlNameChild)?.touched
        && this.sectionForm.controls[controlName].get(controlNameAnswer)?.get(controlNameChild)?.hasError('required') ? true : false;
    }
    else {
      return this.sectionForm.get(controlName)?.touched && this.sectionForm.get(controlName)?.hasError('required') ? true : false;
    }
  }

  /**
   * @description This function validates the step form fields
   */
  validateStepForm(): void {
    this.isValidStepForm = true;
    console.log(this.sectionQuestions);
    for (let question of this.sectionQuestions) {
      let answers: Answer[] = this.toJson(question.answersInJson);
      if (question.parent != undefined && question.parent > 0 && !this.childQuestions.get(question.id)!.isParentSelected) {
        return;
      }
      if (question.widgetType == 'checkbox') {
        let isOneSelected: boolean = false;
        answers.forEach(answer => {
          let value = this.sectionForm.controls[question.id.toString()].get(answer.id.toString())?.value;
          if (value != undefined && value == true) {
            isOneSelected = true;
          }

          if (value == true && answer.text.toUpperCase().includes("Cuál")) {
            let value = this.sectionForm.controls[question.id.toString()].get("which")?.value;
            if (value == undefined || value == '') {
              this.isValidQuestionsLog.set(question.id, false);
              this.isValidStepForm = false;
            }
            else {
              this.isValidQuestionsLog.set(question.id, true);
            }
          }
        });
        if (!isOneSelected) {
          this.isValidStepForm = false;
          this.isValidQuestionsLog.set(question.id, false);
        }
        else {
          this.isValidQuestionsLog.set(question.id, true);
        }
      }
      if (question.widgetType == 'choice') {
        let value = this.sectionForm.get(question.id.toString())?.value;
        console.log('choice');
        console.log(value);
        if (value == undefined || value == '') {
          this.isValidQuestionsLog.set(question.id, false);
          this.isValidStepForm = false;
          this.isValidQuestionsLog.set(question.id, false);
          this.isValidStepForm = false;
          console.log(this.isValidStepForm);
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
      }
      if (question.widgetType == 'input' || question.widgetType == 'dropdown') {
        console.log('dropdown');
        console.log(this.isValidStepForm);
        let value = this.sectionForm.get(question.id.toString())?.value;
        console.log(value);
        if (value == undefined || value == '') {
          this.isValidQuestionsLog.set(question.id, false);
          this.isValidStepForm = false;
          console.log(this.isValidStepForm);
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
      }
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
    if (this.indexQuestions + 2 <= this.questions.length) {
      for (this.indexQuestions; this.indexQuestions < this.iterationQuestions; this.indexQuestions++) {
        let length: number = this.getLengthChildren(this.questions[this.indexQuestions].id);
        this.sectionQuestions.push(this.questions[this.indexQuestions]);
        if (length > 0) {
          this.iterationQuestions += length;
        }
      }
      this.iterationQuestions = this.indexQuestions + 2;
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
      this.session.setSessionStorage(this.consts.PERCEPTIONS_SECTION_FORM, this.sectionForm.value);
      window.location.href = ConstantsService.BASE_PATH + '/comportamiento';
    }

    if (this.indexQuestions >= 6 && this.iterationQuestions <= 8) {
      this.showTitle = true;
      this.indexQuestions = 0;
      this.iterationQuestions = 2;
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
    if (this.showTitle) {
      this.showTitle = false;
      if (this.showDefinitions && this.sectionDefinitions.length == 0) {
        this.showDefinitions = false;
      }
    }
    else if (this.showDefinitions) {
      this.showDefinitions = false;
    }
    this.validateStepForm();
    if (this.isValidStepForm && this.indexQuestions >= this.questions.length) {
      this.showThanks = true;
      this.sectionQuestions = [];
      this.saveQuestions();
      return;
    } else if (this.isValidStepForm) {
      this.sectionQuestions = [];
      this.beforeQuestionsLog.set(this.indexQuestions, this.iterationQuestions);
      this.defineQuestionsIteration();
      return;
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
    this.session.setSessionStorage(this.consts.PERCEPTIONS_SECTION_FORM, this.sectionForm.value);
    this.session.setSessionStorage(this.consts.PERCEPTIONS_SECTION_QUESTIONS, this.answersSurvey);
    this.saveAllSectionQuestions();
    console.log(this.questions);
    console.log(this.sectionForm);
    console.log(this.answersSurvey);
  }

  /**
   * @description This function saves all survey answers
   */
  saveAllSectionQuestions(): void {
    this.showSpinner = true;

    let socioSurveyAnswers: SurveyAnswer[] = this.session.getSessionStorage(this.consts.SOCIO_SECTION_QUESTIONS);
    let behaviorSurveyAnswers: SurveyAnswer[] = this.session.getSessionStorage(this.consts.BEHAVIOR_SECTION_QUESTIONS);
    let allSurveyAnswers: SurveyAnswer[] = [];

    if (socioSurveyAnswers != undefined) {
      allSurveyAnswers = allSurveyAnswers.concat(socioSurveyAnswers);
    }
    if (behaviorSurveyAnswers != undefined) {
      allSurveyAnswers = allSurveyAnswers.concat(behaviorSurveyAnswers);
    }
    if (this.answersSurvey != undefined) {
      allSurveyAnswers = allSurveyAnswers.concat(this.answersSurvey);
    }

    console.log(allSurveyAnswers);
    this.service.saveQuestionsAnswers(allSurveyAnswers).subscribe(
      (data) => {
        this.showSpinner = false;
      },
      (error) => {
        console.error(error);
        this.showSpinner = false;
      }
    );
  }

}
