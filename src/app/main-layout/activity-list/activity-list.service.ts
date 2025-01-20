import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';
import { from } from 'rxjs'; 

@Injectable()
export class ActivitylistService {
  UserProfileManagementUrl = 'api/Admin';
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  getMasters(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  uploadprofileimg(clsobj:FormData) {
    return this.sharedService.postForFormData(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_uploadProfile_v3", clsobj);
  }
  getawskey(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  SaveActivity(addActivity: FormData) {
    return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_articles", addActivity));
  }
 
  
}
