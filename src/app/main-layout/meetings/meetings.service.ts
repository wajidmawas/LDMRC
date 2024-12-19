import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../../shared/Shared.Service';
import { Observable } from 'rxjs';

@Injectable()
export class Meetingsservice {
  UserProfileManagementUrl = 'api/Admin';
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  getStoredFolders(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/getStoredFolders_v3", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  getSubMedia(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/getFilesAsync_v3", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  createFolder(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_CreateFolderByClient_V3", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

  updateFolder(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_updateFolderByClient", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }


  uploadContentCompleted(data: any): Observable<any> {
    return this.http.post<any>(this.sharedService._baseUrl + this.sharedService.AuthServiceUrl + "/completeupload", data,{ headers: this.sharedService.returnHttpHeadersWithDefaultTokenWithClient(data.clientCode)});
  }

  postUploadContent(formData: FormData, data:any): Observable<any> {
    const headers = new HttpHeaders({
      // You can set headers here if needed
    });

    return this.http.post<any>(this.sharedService._baseUrl + this.sharedService.AuthServiceUrl + "/uploadchunk", formData, { headers: this.sharedService.returnHttpHeadersWithDefaultTokenWithClient(data.clientCode)});
  }
  
  updateBulkMedia(clsobj:object) {
    return this.http.post(this.sharedService._baseUrl + this.UserProfileManagementUrl + "/_deleteBulkMedia", clsobj,{ headers: this.sharedService.returnHttpHeaders()});
  }

}