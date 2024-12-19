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
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/GetMasters", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  getPlayersByClient(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_GetPlayersByClient", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  getPublishedCampaignsStatus(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_getPublishedCampaignsStatusByClient_V3", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  getPublishedCampaignsStatusByClient_V4(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/getPublishedCampaignStatusByClient_v4", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  publishedCampaignsStatusByClient_V3(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/publishedCampaignsByClient_v3", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  getClientAdminInvoice_V3(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_getClientAdminInvoice_v3", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }
}


