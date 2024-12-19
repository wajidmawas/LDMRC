import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';
@Injectable()
export class RegisterService {

  constructor(private http: HttpClient, private sharedService:SharedService) {
  }

  RegisterClient(updatedLoggedInUser: object) { 
    return this.http.post(this.sharedService._baseUrl + this.sharedService.AuthServiceUrl + "/Register", updatedLoggedInUser);
  }

  getMasters(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/_GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
    
  }
 
}
