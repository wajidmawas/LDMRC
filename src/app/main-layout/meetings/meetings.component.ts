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
  Mymetting: Meeting[] = [];
  isLoggedIn:any ='';
  userdetails:any={};
  selectedmeeting: any = null;
  searchValue:any='';
  messages: Message[] = [];
  constructor(private service:Meetingsservice, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper").fadeOut();
    }, 300);
    const today = new Date();
  }
  ngOnInit() {  
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    this.userdetails = JSON.parse(this.isLoggedIn)
    this.getupcomingmetting(0);
    this.getmymetting(this.userdetails.user_id)
    this.getmymessage(this.userdetails.user_id)
    
  }
  getupcomingmetting(id: any) { 
    const objRequest = {
      typeId: 19,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {   
         const parseresponse = JSON.parse(response.response);  
        const metting = parseresponse.Table.filter((item: any) =>(item.is_training === false || item.is_training === null));
        this.upcomingmeetings = metting; 
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }

  getmymetting(id: number) { 
    const objRequest = {
      typeId: 27,
      userid: id,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
         const parseresponse = JSON.parse(response.response); 
 const metting = parseresponse.Table.filter((item: any) =>(item.is_training === false || item.is_training === null));
 this.Mymetting = metting;
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
  getmymessage(id: number) { 
    const objRequest = {
      typeId: 31,
      userid: id,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
         const parseresponse = JSON.parse(response.response); 
        this.messages = parseresponse.Table;
        console.log(this.messages);
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  sanitizeFilePath(filePath: string) {
    // Fix backslashes in URLs and sanitize for safe rendering
    return filePath.replace(/\\/g, '/');
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
   // Method to open the Zoom meeting link
   joinZoomMeeting(meeting: any) {
    // Open the Zoom link in a new tab or window
    window.open(meeting.meeting_link, '_blank');
  }
  viewmeeting(accesstoken:string){ 
    window.location.href = "/meeting_detail/"+accesstoken; 
  }
  ReSchedule(meeting:any) {
    window.location.href = "/addmeetings?id="+meeting.id;
  }
  setSelectedmeeting(meeting: any): void {
    this.selectedmeeting = meeting;
  }
  onSearchChange(tableid:string): void {  
    $("#tblMeeting").find("tbody tr").show()
    if(this.searchValue!=null && this.searchValue!=undefined && this.searchValue!=""){
      let searchkeyword=this.searchValue;
      $("#tblMeeting").find("tbody tr").each(function (ind, val) { 
            if ($(this).find("td")[2].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1 && 
                $(this).find("td")[3].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1) {
                $(this).hide();
            }
            else {
                $(this).show();
            } 
    });
   
    }
     
  }
  Cancelmeeting(meeting:any) { 
    const objRequest = {
      typeId: 20,
      userid: 0,
      filterId: meeting.id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
         const parseresponse = JSON.parse(response.response); 
         window.location.reload();
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
    window.location.href = "/addmeetings";
  }
  addmessage(){
    window.location.href = "/addmessage";
  }
}
export interface Meeting {
  title: string;
  Day: string;
  Date: string;
  time: string;
  code: string;
  Meeting: string;
  organizer: string; 
  stateNm: string;
  DurationInNightsAndDays: string;
  Meetingstatus:number;

}

export interface Message {
  id: number;
  msg_date: string;
  msg_time: string;
  file_path: string;
  title: string;
  description: string;
  Datetime: string;
  Sender: string;
}

