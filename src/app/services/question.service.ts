import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { Question } from '../model/question';
import { Observable } from 'rxjs';
import { SurveyAnswer } from '../model/survey-answer';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private http: HttpClient,
    private consts: ConstantsService) { }

  /**
   * @description This function invokes GET method of questions
   */
  private getQuestionsAnswersObservable(apiEndpoint: string): Observable<Question[]> {
    return this.http.get<Question[]>(apiEndpoint + this.consts.QUESTION_PATH);
  }

  /**
   * @description This function gets the survey questions with their answer options
   */
  public getQuestionsAnswers(): Observable<Question[]> {
    return this.getQuestionsAnswersObservable(this.consts.BASE_URL);
  }

  /**
  * @description This function invokes POST method of survey answer
  */
  private saveQuestionsAnswersObservable(apiEndpoint: string, surveyAnswers: SurveyAnswer[]): Observable<SurveyAnswer[]> {
    return this.http.post<SurveyAnswer[]>(apiEndpoint + this.consts.SURVEY_ANSWER_PATH, surveyAnswers);
  }

  /**
   * @description This function saves the survey answers 
   */
  public saveQuestionsAnswers(surveyAnswers: SurveyAnswer[]): Observable<SurveyAnswer[]> {
    return this.saveQuestionsAnswersObservable(this.consts.BASE_URL, surveyAnswers);
  }
}
