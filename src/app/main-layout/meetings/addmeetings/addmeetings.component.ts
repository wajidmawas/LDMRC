import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { Meetingsservice } from '../meetings.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'addmeetings', 
  templateUrl: './addmeetings.component.html',
  styleUrl: './addmeetings.component.scss'
})
export class AddmeetingsComponent {
   designationsList: { id: string,name : string, selected: boolean }[] = [];
  isLoggedIn:any='';
  selectedOption: string = '1';
  isonline: boolean = false;
  clsinvite:cls_addmeeting=new cls_addmeeting();
  constructor(private service:Meetingsservice, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
  }
  ngOnInit() {  
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    this.getLookupMaster(0);
  }
 
  backtohome(){
    window.location.href = "/meetings";
  }
  onOptionChange() {
    //  this.clsinvite.isonline = this.selectedOption === '0'; // Set true if value is '1', otherwise false
   
  }
  cancel() {
  }

  invite() {
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var validate:boolean=false;
    if(this.clsinvite.title == undefined || this.clsinvite.title == null || this.clsinvite.title == '') {
      this.snackbar.showInfo("Please enter title","Error");
      validate=true;
    }
    else if(this.clsinvite.time == undefined || this.clsinvite.time == null || this.clsinvite.time == '') {
      this.snackbar.showInfo("Please enter time","Error");
      validate=true;
    }
    else if(this.clsinvite.date == undefined || this.clsinvite.date == null || this.clsinvite.date == '') {
      this.snackbar.showInfo("Please select date ","Error");
      validate=true;
    }
  
    // else if(this.clsinvite.organiser == undefined || this.clsinvite.organiser == null || this.clsinvite.organiser == 0) {
    //   this.snackbar.showInfo("Please select your organiser","Error");
    //   validate=true;
    // }
    else if(this.clsinvite.notification == undefined || this.clsinvite.notification == null || this.clsinvite.notification == 0) {
      this.snackbar.showInfo("Please select your notification","Error");
      validate=true;
    }
    else if(this.clsinvite.duration == undefined || this.clsinvite.duration == null || this.clsinvite.duration == '') {
      this.snackbar.showInfo("Please enter your duration","Error");
      validate=true;
    }
    else if(this.clsinvite.durationtype == undefined || this.clsinvite.durationtype == null || this.clsinvite.durationtype == 0) {
      this.snackbar.showInfo("Please select  your durationtype","Error");
      validate=true;
    }
    else if(this.clsinvite.description == undefined || this.clsinvite.description == null || this.clsinvite.description == '') {
      this.snackbar.showInfo("Please enter your description","Error");
      validate=true;
    }
   if(!validate) {
    $(".page-loader-wrapper-review").show(); 
    this.service.InviteClient(this.clsinvite).subscribe((res: any) => {
      setTimeout(() => {
        $(".page-loader-wrapper-review").hide();
      }, 500);
      var response = res;
      if (response["errorCode"] == "200") {
        this.snackbar.showSuccess(response.message,response.status);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      else {
        // console.error("API returned an error:", response.message); 
        this.snackbar.showInfo(response["message"],"Error");
      }
    });
    
   }
    
  }
  getLookupMaster(id: any) {
    const objRequest = {
      typeId: 1,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        const parseresponse = JSON.parse(response.response); 
        this.designationsList = parseresponse.Table2;
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  updateDesignations(designation: any): void {
    debugger;
    // Filter the selected designations
    if (designation.selected) {
      // Add the selected designation in the desired format
      const selectedDesignation = { id: designation.id };
      // Add it to the array if it's not already present
      if (!this.clsinvite.designations.some(d => d.id === designation.id)) {
        this.clsinvite.designations.push(selectedDesignation);
      }
    } else {
      // Remove the designation if it is unchecked
      this.clsinvite.designations = this.clsinvite.designations.filter(d => d.id !== designation.id);
    }
  }
  
}


export class cls_addmeeting {
  constructor(){

  }
  title: string='';
  date: string= '';
  time:string=''; 
  organizer:number=0;
  notification:number=0;
  duration:string = '';
  durationtype:number=0;
  description: string = '';
  isonline:number=0;
  meeting_location:string='Hyd';
  meeting_link:string='httpdsdsandajndjan';
  short_desc:string='';
  is_reschdule:number=0;
  created_by:number=0;
  duration_type:string='type';
  // organizer_id:number=0;
      designations: { id: string }[] = [];
    participants: { id: number }[] = [
      { id: 0 }
    ];
    // participants: string[] = ["1","2"]  // Initially an empty array
}
