import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AlertsService } from './alerts.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})

export class AlertsComponent implements OnInit, OnDestroy, AfterViewInit {
 
  userDtail: any = {};
  allnotifications:any = {}
  noofpages:any=0;
  noofrecords:any=0;
  pagecount:any=1;
constructor(public sharedService: SharedService, private snackbar:SnackbarService, 
    private translate:TranslateService, private _matDialog: MatDialog, private service:AlertsService,private titleService: Title) {
    this.userDtail = this.sharedService.getUserSession();
    this.titleService.setTitle("AICC - " + this.translate.instant("Menu.lblAlerts"));
}

ngOnDestroy(): void {
    
}

ngOnInit(): void {
  this.userDtail = this.sharedService.getUserSession();
  this.getnotifications();
}
prevrecords(){
this.pagecount--;
if(this.pagecount <=0){
  this.pagecount = 1;
}
this.getnotifications();
}
nextrecords(){ 
  this.pagecount++;
  if(this.pagecount > this.noofpages){
    this.pagecount = this.noofpages;
  }
  this.getnotifications();
   
}
read(id:any){ 
  var objRequest = {  
    UserId:this.userDtail.userid,
FilterId:this.userDtail.customerid,
Type : id,
ClientId:'UPDATENOTIF'
  }
  this.sharedService.updatereadinfo(objRequest).subscribe((result: any) => {  
    if (result["status"] == "200") {
       this.getnotifications() 
      }    
    else { 
     this.snackbar.showInfo(result["message"],"Error");
    }
     
  }); 
}
getnotifications(){ 
  var objRequest = { 
    clientId: this.userDtail.customerid,
    featureId: 117,
    pageNo: this.pagecount,
    seqNo: 0,
    keyword: "",
    filterId: this.userDtail.userid,
    pageCount: 50
  }
  this.sharedService.notifications(objRequest).subscribe((result: any) => {  
    if (result["status"] == "200") {
      this.allnotifications = result["objresult"]["table"]; 
      this.noofpages = result["objresult"]["table1"][0]["noofpages"];
      this.noofrecords = result["objresult"]["table1"][0]["noofrecords"];
      this.allnotifications.forEach((element:any) => {
          if(element.auditlog_actionPerform == "CAMPAIGN UPDATED"){
            element.icon = 'icon-info text-warning mr-2';
          }
          else if (element.auditlog_actionPerform == "CAMPAIGN DELETED"|| element.auditlog_actionPerform == "PLAYER DELETED"){
            element.icon = 'icon-info text-danger mr-2';
          }
          else if (element.auditlog_actionPerform == "CAMPAIGN ADDED" || element.auditlog_actionPerform == "PLAYER ADDED"){
            element.icon = 'icon-info text-success mr-2';
          }
      }); 
      }    
    else { 
     this.snackbar.showInfo(result["message"],"Error");
    }
     
  }); 
}
ngAfterViewInit(): void {
 
}

}