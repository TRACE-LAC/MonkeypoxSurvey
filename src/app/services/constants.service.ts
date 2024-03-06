import { Injectable } from '@angular/core';
import { Question } from '../model/question';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public static BASE_PATH: string = '/encuesta';

  public BASE_URL: string = 'https://cosex.lat:8090/';
  // public BASE_URL: string = 'https://20.22.187.215:8090/';
  //public BASE_URL: string = 'http://localhost:8090/';
  public AUTH_PATH = "authentication";
  public QUESTION_PATH = "question/answers";
  public SURVEY_ANSWER_PATH = "survey/answers";

  public GEO_PATH: string =
    "https://www.datos.gov.co/resource/xdk5-pm3f.json";
  public DEPARTMENTS_PATH: string =
    "?\$select=distinct%20departamento,c_digo_dane_del_departamento order by departamento";
  public MUNICIPALITIES_PATH: string = "?departamento=";
  public GEO_API_KEY = '28SOOYzUYQG8YdJeY1T3X7fdr';

  public DEFAULT_TOKEN: string = 'defaultToken';

  public DEFAULT_QUESTIONS: string = 'defaultQuestions';

  public SOCIO_SECTION_QUESTIONS: string = 'sociodemographic';
  public BEHAVIOR_SECTION_QUESTIONS: string = 'behavior';
  public PERCEPTIONS_SECTION_QUESTIONS: string = 'perceptions';

  public SOCIO_SECTION_FORM: string = 'sociodemographicFm';
  public BEHAVIOR_SECTION_FORM: string = 'behaviorFm';
  public PERCEPTIONS_SECTION_FORM: string = 'perceptionsFm';

  public SOCIO_SECTION_CHILD_QUESTIONS: string = 'sociodemographicChd';
  public BEHAVIOR_SECTION_CHILD_QUESTIONS: string = 'behaviorChd';
  public PERCEPTIONS_SECTION_CHILD_QUESTIONS: string = 'perceptionsChd';

  public MUNICIPALITIES: string = 'municipalities'

  public SURVEY_QUESTIONS: Question[] = [];

  constructor() { }

  /**
  * @description This function gets the questions of a specific section
  */
  getSectionQuestionsWithAnswers(section: string): Question[] {
    var questionsSection: Question[] = [];
    this.SURVEY_QUESTIONS.forEach(question => {
      if (question.section == section && question.enabled) {
        questionsSection.push(question);
      }
    });
    return questionsSection;
  }

  /**
  * @description This function converts a string to JSON
  */
  static toJson(data: string): any {
    return JSON.parse(data);
  }
}
