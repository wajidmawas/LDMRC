import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';
import { from } from 'rxjs';

@Injectable()
export class dashboardService {
  UserProfileManagementUrl = 'api/Admin';
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  // Method for fetching the list of all players by filters
  getMasters(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/_GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  } 
  getLeadersByPaging(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/_getLeadersByPaging", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  } 
  Saveldm(addldm: FormData) {
      return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_ldm", addldm));
    }
    Saveknowledge(addknowledge: FormData) {
      return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_knowledgebase", addknowledge));
    }
    SaveSlider(addActivity: FormData) {
      return from(this.sharedService.postForFormData(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/save_slider", addActivity));
    }
}


