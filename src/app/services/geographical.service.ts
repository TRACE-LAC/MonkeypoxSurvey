import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { Deparment } from '../model/deparment';
import { Municipalitie } from '../model/municipalitie';

@Injectable({
  providedIn: 'root'
})
export class GeographicalService {

  constructor(
    private http: HttpClient,
    private consts: ConstantsService) { }

  /**
   * @description This function invokes GET method of departments API
   */
  private getDepartmentsObservable(apiEndpoint: string): Observable<Deparment[]> {
    return this.http.get<Deparment[]>(apiEndpoint + this.consts.DEPARTMENTS_PATH);
  }

  /**
   * @description This function gets the Colombia's departments
   */
  public getDepartments(): Observable<Deparment[]> {
    return this.getDepartmentsObservable(this.consts.GEO_PATH);
  }

  /**
   * @description This function invokes GET method to municipalities of departments API
   */
  private getMunicipalitiesObservable(apiEndpoint: string, deparment: string): Observable<Municipalitie[]> {
    return this.http.get<Municipalitie[]>(apiEndpoint + this.consts.MUNICIPALITIES_PATH + deparment);
  }

  /**
   * @description This function gets the Colombia's municipalities
   */
  public getMunicipalities(deparment: string): Observable<Municipalitie[]> {
    return this.getMunicipalitiesObservable(this.consts.GEO_PATH, deparment);
  }
}