import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';
import { Observable } from 'rxjs';

@Injectable()
export class Footerservice {
  UserProfileManagementUrl = 'api/Admin';
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }


}