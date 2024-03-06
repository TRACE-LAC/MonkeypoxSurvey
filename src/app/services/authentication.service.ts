import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ConstantsService } from './constants.service';
import { TokenResponse } from '../model/token-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private consts: ConstantsService) { }

  /**
   * @description This function invokes POST method of authentication
   */
  private postAuthenticateObservable(apiEndpoint: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(apiEndpoint + this.consts.AUTH_PATH, {});
  }

  /**
   * @description This function creates a session
   */
  public postAuthenticate(): Observable<TokenResponse> {
    return this.postAuthenticateObservable(this.consts.BASE_URL);
  }
}
