import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  /**
   * @description This function gets a property of session storage
   */
  getSessionStorage(ss: any): any {
    if (ss) { }
    const session = sessionStorage.getItem(ss);
    if (session) {
      return this.decodedData(session);
    }

  }

  /**
   * @description This function sets a property of session storage
   */
  setSessionStorage(key: any, value: any): void {
    const base = this.encodedData(value);
    sessionStorage.setItem(key, base);
  }

  /**
   * @description This function clears the property content of session storage
   */
  clearSessionStorage(ss: any): void {
    sessionStorage.removeItem(ss);
  }

  /**
   * @description This function clears the session storage
   */
  clearAllSessionStorage(): void {
    sessionStorage.clear();
  }

  /**
   * @description This function decodes the property content of session storage
   */
  decodedData = (data: any) => {
    data = decodeURIComponent(escape(atob(data)));
    if (data.includes('{')) {
      return JSON.parse(data);
    }
    else {
      return data;
    }
  }

  /**
   * @description This function encodes the property content of session storage
   */
  encodedData = (data: any) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }
}
    
    
