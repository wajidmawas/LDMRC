import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';

@Injectable()
export class dashboardService {
  UserProfileManagementUrl = 'api/Admin';
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  // Method for fetching the list of all players by filters
  getMasters(clsobj:object) { 
    return this.http.post(this.sharedService._baseUrl + this.sharedService.AdminServiceUrl + "/_GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  } 
}


