import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenResponse } from '../model/token-response';
import { SessionStorageService } from '../services/session-storage.service';
import { HttpError } from './http-error';
import { catchError } from 'rxjs/operators';
import { ConstantsService } from '../services/constants.service';
import { ModalService } from '../services/modal.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  token: TokenResponse;

  constructor(
    public session: SessionStorageService,
    private consts: ConstantsService,
    private router: Router,
    // private modal: NgbModal,
    private modalService: ModalService) {
    this.token = {} as TokenResponse;
  }

  /**
   * @description This function intercepts all service requests and 
   * adds the session token to them
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.token = this.session.getSessionStorage(this.consts.DEFAULT_TOKEN);
    let request = req;
    if (this.token != null && this.token != undefined) {
      if(!request.url.includes(this.consts.GEO_PATH)) {
        request = req.clone({
          setHeaders: {
            authorization: `Bearer ${this.token.token}`
          }
        });
      } else {
        request = req.clone({
          setHeaders: {
            'X-App-Token': this.consts.GEO_API_KEY
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case HttpError.Unauthorized:
            // this.modal.dismissAll();
            this.router.navigateByUrl('');
            break;
          case HttpError.Forbidden:
            // this.modal.dismissAll();
            this.router.navigateByUrl('');
            break;
          case HttpError.InternalServerError:
            this.modalService.open('error-message');
            break;
          case HttpError.TimeOut || HttpError.ConnectionRefused:
            this.modalService.open('error-message');
            break;
          case HttpError.ConnectionRefused:
            this.modalService.open('error-message');
            break;
        }
        return throwError(err);
      })
    );
  }
}
