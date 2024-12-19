import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';

@Injectable()
export class AlertsService {
  UserProfileManagementUrl = 'api/Admin';
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  getMasters(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
  
}
