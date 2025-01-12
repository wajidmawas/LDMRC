import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { Meetingsservice } from '../meetings/meetings.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'meetings',
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent {
  upcomingmeetings: Meeting[] = [];
  isLoggedIn:any ='';
  constructor(private service:Meetingsservice, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
    const today = new Date();
  }
  ngOnInit() {  
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    this.getupcomingmetting(0);
  }
  getupcomingmetting(id: any) {
    debugger;
    const objRequest = {
      typeId: 19,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        debugger;
         const parseresponse = JSON.parse(response.response); 
 const metting = parseresponse.Table;
 this.upcomingmeetings = metting;
  console.log(metting);
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
 
  backtohome(){
    window.location.href = "/dashboard";
  }
   // Method to open the Zoom meeting link
   joinZoomMeeting(meeting: any) {
    // Open the Zoom link in a new tab or window
    window.open(meeting.meeting_link, '_blank');
  }
  ReSchedule(meeting:any) {
    window.location.href = "/meetings/addmeetings?id="+meeting.id;
  }
  Cancel(meeting:any) {
    debugger;
    const objRequest = {
      typeId: 20,
      userid: 0,
      filterId: meeting.id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        debugger;
         const parseresponse = JSON.parse(response.response); 
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }

  addmeeting(){
    window.location.href = "/meetings/addmeetings";
  }
  addmessage(){
    window.location.href = "/meetings/addmessage";
  }
}
export interface Meeting {
  title: string;
  Day: string;
  Date: string;
  time: string;
  Meeting: string;
  organizer: string;
}
