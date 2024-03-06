import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Answer } from 'src/app/model/answer';
import { SurveyAnswer } from 'src/app/model/survey-answer';
import { Child } from 'src/app/model/child';
import { Definition } from 'src/app/model/definition';
import { Question } from 'src/app/model/question';
import { ConstantsService } from 'src/app/services/constants.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-sexual-behavior-section',
  templateUrl: './sexual-behavior-section.component.html',
  styleUrls: ['./sexual-behavior-section.component.css']
})
export class SexualBehaviorSectionComponent implements OnInit {

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

  isValidQuestionsLog: Map<number, boolean>;
  isValidStepForm: boolean;

  constructor(private consts: ConstantsService,
    private session: SessionStorageService,
    private fb: FormBuilder) {
    this.sectionForm = this.fb.group({});
    this.questions = [];
    this.sectionQuestions = [];
    this.indexQuestions = 0;
    this.iterationQuestions = 2;
    this.sectionName = "B: Información sobre prácticas sexuales";
    this.sectionDefinitions = [];
    this.showSpinner = false;
    this.departmentSelected = "";
    this.otherSelected = {} as Answer;
    this.showTitle = true;
    this.showDefinitions = true;
    this.showThanks = false;
    this.animationPath = "";

    this.childQuestions = new Map<number, Child>();

    this.beforeQuestionsLog = new Map<number, number>();

    this.whichQuestionsLog = new Map<number, string>();

    this.answersSurvey = [];

    this.isValidStepForm = true;

    this.isValidQuestionsLog = new Map<number, boolean>();

    this.defineAnimation();
    this.setDefinitions();
    this.getQuestionsSection();
    this.getForm();
    this.defineChildQuestion();
    this.defineWhichQuestions();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getForm();
    this.defineChildQuestion();
    this.defineWhichQuestions();
  }

  /**
   * @description This function defines the animation path according to the window width
   */
  defineAnimation(): void {
    if (window.innerWidth <= 600) {
      this.animationPath = "assets/animations/sexual_behavior_section_ver.mp4";
    }
    else {
      this.animationPath = "assets/animations/sexual_behavior_section.mp4";
    }
  }

  /**
  * @description This function sets the section definitions
  */
  setDefinitions(): void {
    this.sectionDefinitions.push({
      title: "Parejas sexuales:",
      text: "Personas con las que haya tenido relaciones o prácticas sexuales manuales, orales o genitales."
    });
    this.sectionDefinitions.push({
      title: "Pareja estable:",
      text: "Personas con quienes ha tenido relaciones o prácticas sexuales manuales, orales, genitales  por más de seis meses, de las cuales no ha recibido ni ofrecido dinero, regalos o favores a cambio de sexo."
    });
    this.sectionDefinitions.push({
      title: "Pareja ocasional:",
      text: "Personas con quienes ha tenido relaciones o prácticas sexuales manuales, orales o genitales por menos de seis meses, de las cuales no ha recibido ni ofrecido dinero, regalos o favores a cambio de sexo."
    });
    this.sectionDefinitions.push({
      title: "Sexo grupal:",
      text: "Relaciones sexuales con más de una pareja en el mismo encuentro sexual."
    });
    this.sectionDefinitions.push({
      title: "Sexo transaccional:",
      text: "Relaciones sexuales por las cuales ha recibido u ofrecido dinero, regalos o favores a cambio."
    });
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
    });
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
    let valuesForm = this.session.getSessionStorage(this.consts.BEHAVIOR_SECTION_FORM);
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
            answerGroup[answer.id.toString()] = new FormControl('', Validators.required);
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
      this.session.setSessionStorage(this.consts.BEHAVIOR_SECTION_FORM, this.sectionForm.value);
      window.location.href = ConstantsService.BASE_PATH + '/sociodemografico';
    }

    if (this.showDefinitions) {
      this.showDefinitions = false;
      this.showTitle = true;
      this.indexQuestions = 0;
      this.iterationQuestions = 2;
      return;
    }

    if (this.indexQuestions >= 2 && this.iterationQuestions <= 4) {
      this.showDefinitions = true;
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
      this.showDefinitions = true;
    }
    else if (this.showDefinitions) {
      this.showDefinitions = false;
    }
    if (this.indexQuestions >= this.questions.length) {
      this.showSpinner = true;
      this.saveQuestions();
      window.location.href = ConstantsService.BASE_PATH + '/percepciones';
    }
    if (!this.showDefinitions) {
      this.validateStepForm();
      if (this.isValidStepForm) {
        this.sectionQuestions = [];
        this.beforeQuestionsLog.set(this.indexQuestions, this.iterationQuestions);
        this.defineQuestionsIteration();
      }
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
    this.session.setSessionStorage(this.consts.BEHAVIOR_SECTION_FORM, this.sectionForm.value);
    this.session.setSessionStorage(this.consts.BEHAVIOR_SECTION_QUESTIONS, this.answersSurvey);
    console.log(this.questions);
    console.log(this.sectionForm);
    console.log(this.answersSurvey);
  }

}
