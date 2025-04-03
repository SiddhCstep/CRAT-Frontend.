import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, delay, Observable, of, throwError } from 'rxjs';



interface JwtResponse {
  refresh: string;
  access: string;
}




@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  middlewareURL: string = 'http://172.16.7.42/django/';
  //middlewareURL  : string = 'https://crat.cstep.in/django/'

  // geoServerURL: string = 'http://geoservermp.cstep.in:8080/';
  geoServerURL: string = 'https://geoservermp.cstep.in:8443/';


  login(value: any) {
    return this.http.post<JwtResponse>(this.middlewareURL + "account/auth/jwt/create", value)
  }

  register(value: any) {
    return this.http.post(this.middlewareURL + "account/auth/users/", value)
  }

  forgotpassword(value: any) {
    return this.http.post(this.middlewareURL + "account/auth/users/reset_password/", value)
  }

  updatePassword(value: any, headers: any) {
    return this.http.post(this.middlewareURL + "account/auth/users/set_password/", value, { headers });
  }

  getSectorname(headers: any): Observable<{ id: number; sector_name: string; }[]> {
    return this.http.get<{ id: number; sector_name: string; }[]>(this.middlewareURL + "api/sectors", { headers });
  }

  getUserDetails(headers: any): Observable<{ name: string; }> {
    return this.http.get<{ name: string; }>(this.middlewareURL + "account/auth/users/me/", { headers });
  }

  getVulnerabilitiesIndicators(value: any, headers: any): Observable<{
    vulnerability_name: string; indicators: any;
  }[]> {
    return this.http.get<{
      vulnerability_name: string; indicators: any;
    }[]>(this.middlewareURL + "api/sectors/" + `${value}` + "/vulnerabilities/", { headers });
  }

  getExposureIndicator(value: any, headers: any, no: any): Observable<any> {
    return this.http.get<any[]>(this.middlewareURL + "api/sectors/" + `${value}` + "/exposure-indicators/?no_data=" + `${no}`, { headers })
  }

  getExposurePercentageValue(value: any, headers: any): Observable<any> {
    return this.http.post<any>(this.middlewareURL + "api/sectors/exposure-percentage/", value, { headers });
  }

  getVulnerabilityinduxvalue(sectoroption: any, value: any, headers: any, string: string): Observable<{ district_name: string; vulnerability_index: number; }[]> {
    console.log(string);
    
    return this.http.post<{ district_name: string; vulnerability_index: number; }[]>(this.middlewareURL + "api/sectors/" + `${sectoroption}` + "/vulnerability-index/", value, { headers })
  }


  // geoServer

  loadGeoJsonData(): Promise<any> {
    return this.http.get(this.geoServerURL + "geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:a_01_CRAT_Hazards0&outputFormat=application/json").toPromise();

  }


  exposureHazradgeoJSON(halfURL: string) {
    return this.http.get(this.geoServerURL + "geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:Hazard_spatial_extent&outputFormat=application/" + `${halfURL}`)
  }


  getLineDataGeoJSON(lineUrlHalfPart: string) {
    return this.http.get(this.geoServerURL + "geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:Polyline2&outputFormat=application/" + `${lineUrlHalfPart}`)
  }


  getPointDataGeoJSON(pointUrlHalfPart: string) {
    return this.http.get(this.geoServerURL + "geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:Point2&outputFormat=application/" + `${pointUrlHalfPart}`)
  }


  getpolygonDataGeoJSON(polygonUrlHalfPart: string) {
    return this.http.get(this.geoServerURL + "geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:Polygon2&outputFormat=application/"+ `${polygonUrlHalfPart}`)
  }


  // data Shared


  private boxNameSubject = new BehaviorSubject<string | null>(null);
  boxName$ = this.boxNameSubject.asObservable();

  setBoxName(name: string) {
    this.boxNameSubject.next(name);
  }


  private selectedOptionSubject = new BehaviorSubject<string | null>(null);
  selectedOption$ = this.selectedOptionSubject.asObservable();

  updateSelectedOption(option: string) {
    this.selectedOptionSubject.next(option);
  }
 


 private Vulnerabilityoptionsformap = new BehaviorSubject<string | null>(null);
 selectedOptionVulnerabilityoptionsformap$ = this.Vulnerabilityoptionsformap.asObservable();

  updateVulnerabilityoptionsformap(option: string) {
    this.Vulnerabilityoptionsformap.next(option);
  }
 

}
