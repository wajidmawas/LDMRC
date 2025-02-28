import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';
import { from } from 'rxjs';

@Injectable()
export class ProfileService {
  UserProfileManagementUrl = 'api/Admin';
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  getMasters(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  getLeadersByPaging(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_getLeadersByPaging", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  UpdateUser(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/Update_User", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  getUserDetailsByAccessToken(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_getUserDetailsByAccessToken", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  uploadprofileimg(clsobj:FormData) {
    return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/upload_profile", clsobj));
  }
  getawskey(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  SaveActivity(addActivity: FormData) {
    return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_articles", addActivity));
  }
  SaveCO(addActivity: FormData) {
    return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_masters", addActivity));
  }
  SaveProfession(Addprofession: object) {  
  console.log(Addprofession);
    return this.http.post(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_userprofession", Addprofession,{ headers: this.sharedService.returnHttpHeaders()});
  }
  Saveldm(addldm: FormData) {
    return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_ldm", addldm));
  }
  Saveldm_2(addldm: FormData) {
    return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_ldm_2", addldm));
  }
}
