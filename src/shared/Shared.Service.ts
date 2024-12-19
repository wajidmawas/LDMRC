import { HttpResponse, HttpParams } from '@angular/common/http';
import { Response, ResponseOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from '../environments/environment';
import { CryptoService } from './crypto.service';
@Injectable()
export class SharedService {

  private currentUserNameSource = new BehaviorSubject('');
  public currentUserName = this.currentUserNameSource.asObservable();

  private permissionSource = new BehaviorSubject([]);
  public permission = this.permissionSource.asObservable();
  userDetails: any = {};
  loginAs: any = '';
  headers: any = new HttpHeaders();
  AuthServiceUrl:any = 'api/UnAuthorized';
  AdminServiceUrl:any = 'api/Admin';
  _baseUrl: string = "";
  _s3Url: string = "";
  _appUrl:string=''; 
  constructor(private router: Router, private http: HttpClient, private crypto:CryptoService) {
    this._baseUrl = environment._baseUrl; 
  }
  extractData(res: Object) {
    let body = res;
    var option = new ResponseOptions();
    option.body = body;
    return new Response(option);
  }

  setCurrentUserName(userName: string) {
    this.currentUserNameSource.next(userName);
  }
  
  notifications(obj: any) {
    return this.http.post(this._baseUrl + this.AdminServiceUrl + "/_getDataIntoChunks", obj, { headers: this.returnHttpHeaders() });
  }
  updatereadinfo(obj: any) {
    return this.http.post(this._baseUrl + this.AdminServiceUrl + "/_getUpdateAlertNotif", obj, { headers: this.returnHttpHeaders() });
  }
   

  getUserSession() {
    if (localStorage.getItem("cl_user") !== undefined && localStorage.getItem("cl_user") !== "" && localStorage.getItem("cl_user") !== null) {
      this.userDetails = JSON.stringify(localStorage.getItem("cl_user"));
      
    }
    
    return this.userDetails;
    
  }
 

  getIsActionAssigned(key:any, featureId:any) {
    let rolexml = JSON.parse(this.getUserSession()._RoleXML);
    var result:boolean=false;
    rolexml.Responsibilities.Object.forEach((element:any) => {
      if(element.ID == featureId) {
        if(element[key] == "1")
            result = true;

        if(element.Actions[key] == "1")
          result = true;
      }
    });

    return result;
  }

  returnHttpHeaders() {
    return this.headers.set('content-type', 'application/json') 
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'CF703BE5EC3D451496FADFABD41118B197CB14263CC1887587AF543620BAA3FB');
  }

  returnHttpHeadersWithDefaultToken() {
    return this.headers.set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('clientid', "5f53c55a");
  }

  returnHttpHeadersWithDefaultTokenWithClient(clientid:any) {
    return this.headers.set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('clientid', clientid);
  }

  returnHttpHeadersForFormData() {
    return this.headers.set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('clientid', this.getUserSession().clientCode)
      .set('reportProgress', true)
      .set('observe', 'events');
  }

  postForFormData(url: string, formData: FormData) {
    const headers = new HttpHeaders()
    .set('clientid', this.getUserSession().clientCode);

    return this.http.post(url, formData, { headers }).pipe(map(this.extractData)).toPromise();
  } 
  sharedService(){

  }
}


export class transactResult {
  objresult: any = {};
  status: string = '';
  message: string = '';
}

export class clsdelete {
  ids: any = [];
  accountId: number = 0;
}
