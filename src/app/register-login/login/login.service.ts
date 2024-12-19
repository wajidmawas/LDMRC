import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';
@Injectable()
export class LoginService {
  UserProfileManagementUrl = 'api/UnAuthorized';
  constructor(private http: HttpClient, private sharedService:SharedService) {
  }

 
  UserLogin(updatedLoggedInUser: any) { 
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/ValidateUser", updatedLoggedInUser);
  }
  validateOTP(clsobj: object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/ValidateUserOTP", clsobj);
  }
  
  forgotPassword(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/ForgotPassword_V3", clsobj);
  }
  getUserIP() {
                this.http.get('https://api.ipify.org/?format=json').subscribe(
                (res:any) => {
                  var ipVar:any = res.ip;
                  // let num = ipVar.indexOf(":");
                  // let num2 = ipVar.indexOf("\"});");
                  //ipVar = ipVar.slice(num+2,num2);
   
                  return ipVar;
                })
  }

}
