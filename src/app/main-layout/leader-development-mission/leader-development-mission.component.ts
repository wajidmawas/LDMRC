 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { dashboardService } from '../dashboard/dashboard.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';   
import { TranslateService } from '@ngx-translate/core';  
import dayGridPlugin from '@fullcalendar/daygrid' 
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
import 'jquery';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-leader-mission',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './leader-development-mission.component.html',
  styleUrl: './leader-development-mission.component.scss'
})
export class LeaderDevelopmentMissionComponent {
  clsldm:cls_addldm=new cls_addldm();
  isLoggedIn:any='';
  Userid:any='';

  userdetails:any={};
  DesignationLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  Users: any = [];
  UsersList: any = [];
  LDMActivities: any = [];
  States: any = [];
  Districts: any = [];
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedDesignation:number | null = null;

  selectedVillage:number | null = null;
  filename: any | null = null;
  ActivitiesDetail:any=[];
  Activities:any=[];
  states: any = []; Assembly: any = [];ActivityType: any = [];DesiginationList: any = [];
  userDtail:any={};ProfessionList: any = [];

  villages:any=[];
  titlesearch:string='';
  activityId: string | null = null;
responseid:any=[];
  constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
      this.userDetail = this.sharedService.getUserSession();
      // this.userdetails=JSON.parse(this.userDetail.user_id);
      this.userDtail = localStorage.getItem("cl_user");
      this.userdetails = JSON.parse(this.userDtail)
    console.log("UserDetails",this.userdetails)
    
      var year  = new Date().getFullYear();
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric',
        month: 'long', // Full month name
        day: 'numeric',
        weekday: 'long', // Full day name
      }; 
  }
   
  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
     if(this.isLoggedIn!=null){
      this.LoadMasters();
      this.LoadUsers() ;
      this.getLookupMaster(0);
      this.getDesigination(0);
      this.getActivityType(0);
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }
  showTab(tab_type:any){  
    this.Users=this.UsersList;
    this.Users=this.Users.filter((item: any) =>(item.stream === tab_type));
  }
  viewDetails(access_token:any){
    window.location.href = "/user-profile/"+access_token;
  }
  LoadMasters() {
    const objRequest = {
      typeId: 1,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.Designations = parseresponse.Table2;
          this.States = parseresponse.Table1; 
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
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
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.states = parseresponse.Table1;
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  LoadUsers() {
    const objRequest = {
      typeId: 8,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.Users = parseresponse.Table2; 
          this.UsersList = parseresponse.Table2; 
          this.Users=this.Users.filter((item: any) =>(item.stream === "SC Dept"));
          this.LDMActivities = parseresponse.Table3; 
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  showmore(type:any){
if(type=='states'){
  this.StatesLimit=this.States.length;
}
else if(type=='designation'){
  this.DesignationLimit=this.Designations.length;
}
  }
  showless(type:any){
    if(type=='states'){
      this.StatesLimit=5;
    }
    else if(type=='designation'){
      this.DesignationLimit=5;
    }
      }
  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
  onActvitytypeChange(event: any): void {
    this.selectedActvity = event.target.value; 
  }
  onDesiginationChange(event: any): void {
    this.selectedDesignation = event.target.value; 
  }
  getDesigination(id: any) {
    const objRequest = {
      typeId: 1,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.DesiginationList = parseresponse.Table2;
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  onstateChange(event: any): void {
    this.selectedState = event.target.value; 
    this.getAssembly(event.target.value) 
  }
  oncityChange(event: any): void {
    this.selectedCity = event.target.value; 
    this.getvillages(event.target.value,this.selectedState);
  }
  onvillageChange(event: any): void {
    this.selectedVillage = event.target.value; 
  }
  getAssembly(id: any) {
    debugger;
    const objRequest = {
      typeId: 8,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
    console.log(JSON.stringify(objRequest));
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
       debugger;
        if (response["errorCode"] === "200") { 
          debugger;
          this.Assembly = parseresponse.Table5
         console.log("Assembly" + JSON.stringify(this.Assembly))
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  getvillages(id: any,state :any) { 
    const objRequest = {
      typeId: 36,
      userid: 0,
      filterId: state,
      filterText: String(id),
      filterText1: ""
    };
    console.log(JSON.stringify(objRequest));
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
        debugger;
        var parseresponse = JSON.parse(response.response); 
       
        if (response["errorCode"] === "200") { 
          debugger;
          this.villages = parseresponse.Table
         console.log("villages" + JSON.stringify(this.villages))
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        const file = input.files[0];
        this.clsldm.imageFile = file; // Assign File object
        debugger;
        this.clsldm.imagePath=file.name;
      }
  }
  onpdfChange(event: any) {
    const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        const file = input.files[0];
        this.clsldm.pdfFile = file; // Assign File object
        this.clsldm.pdfPath=file.name;

      }
  }
  ViewActivityDetails(Activity:any)
  {
    console.log('Activity:', Activity);
    if (Activity && Activity.code) {
      this.router.navigate([`activity_detail`, Activity.code]);
    } else {
      console.error('Invalid Activity object or missing ID');
    }
  }
  CancelActivity()
  {
    this.clsldm = new cls_addldm(); // Reset form data
  }
  SaveActivity() { 
    var validate:boolean=false;
  
    // Perform client-side validation
    if (this.clsldm.title == undefined || this.clsldm.title == null || this.clsldm.title == '') {
      this.snackbar.showInfo("Please enter title", "Error");
      validate = true;
    } else if (this.clsldm.desc == undefined || this.clsldm.desc == null || this.clsldm.desc == '') {
      this.snackbar.showInfo("Please enter short description", "Error");
      validate = true;
    } else if (this.clsldm.expected_outcome == undefined || this.clsldm.expected_outcome == null || this.clsldm.expected_outcome == '') {
      this.snackbar.showInfo("Please enter description", "Error");
      validate = true;
    } else if (this.clsldm.imageFile == undefined || this.clsldm.imageFile == null || this.clsldm.imageFile == '') {
      this.snackbar.showInfo("Please select an image", "Error");
      validate = true;
    }
    else if (this.clsldm.pdfFile == undefined || this.clsldm.pdfFile == null || this.clsldm.pdfFile == '') {
      this.snackbar.showInfo("Please select an image", "Error");
      validate = true;
    }
    else if (this.clsldm.state_id == undefined || this.clsldm.state_id == null || this.clsldm.state_id == 0) {
      this.snackbar.showInfo("Please select an image", "Error");
      validate = true;
    }
    else if (this.clsldm.assembly_id == undefined || this.clsldm.assembly_id == null || this.clsldm.assembly_id == 0) {
      this.snackbar.showInfo("Please select Assembly", "Error");
      validate = true;
    }
    else if (this.clsldm.village_id == undefined || this.clsldm.village_id == null || this.clsldm.village_id == 0) {
      this.snackbar.showInfo("Please select Village", "Error");
      validate = true;
    }
    else if (this.clsldm.designation_id == undefined || this.clsldm.designation_id == null || this.clsldm.designation_id == 0) {
      this.snackbar.showInfo("Please select Desigination", "Error");
      validate = true;
    }
    else if (this.clsldm.no_of_participants == undefined || this.clsldm.no_of_participants == null || this.clsldm.no_of_participants == 0) {
      this.snackbar.showInfo("Please enter participants", "Error");
      validate = true;
    }
    else if (this.clsldm.date_of_posting == undefined || this.clsldm.date_of_posting == null || this.clsldm.date_of_posting == '') {
      this.snackbar.showInfo("Please enter Date", "Error");
      validate = true;
    }
  debugger;
    if (!validate) {
      $(".page-loader-wrapper-review").show();
      const formData = new FormData();
      // Append form fields
      formData.append('date_of_posting', this.clsldm.date_of_posting);
      formData.append('office_bearer', this.clsldm.office_bearer);
      formData.append('desc', this.clsldm.desc);
      formData.append('title', this.clsldm.title);
     // Append file only if it exists
     if (this.clsldm.imageFile && this.clsldm.imageFile instanceof File) {
      formData.append('imageFile', this.clsldm.imageFile);
    }
      // Append file only if it exists
      if (this.clsldm.pdfFile && this.clsldm.pdfFile instanceof File) {
        formData.append('pdfFile', this.clsldm.pdfFile);
      }
      formData.append('imagePath', this.clsldm.imagePath.toString());
      formData.append('pdfPath', this.clsldm.pdfPath.toString());
      formData.append('expected_outcome', this.clsldm.expected_outcome.toString());
      formData.append('state_id', this.clsldm.state_id.toString());
      formData.append('activity_id', this.clsldm.activity_id.toString());
      formData.append('assembly_id', this.clsldm.assembly_id.toString());
      formData.append('village_id', this.clsldm.village_id.toString());
      formData.append('designation_id', this.clsldm.designation_id.toString());
      formData.append('no_of_participants', this.clsldm.no_of_participants.toString());
      formData.append('created_by', this.userdetails.user_id.toString());
      formData.append('id',this.clsldm.id.toString());
  this.service.Saveldm(formData).subscribe((res: any) => {
    setTimeout(() => {
      $(".page-loader-wrapper-review").hide();
    }, 500);
    var response = res;
    if (response.errorCode == "200") {
       this.snackbar.showSuccess(response.message, response.status);
      setTimeout(() => {
        this.responseid=JSON.parse(response.response).Table[0].id;
        if(this.responseid==this.clsldm.id)
        {
          this.clsldm = new cls_addldm(); // Reset form data
          window.location.href = "/leader_development_mission";
        }
        this.clsldm = new cls_addldm(); // Reset form data
  
      }, 3000);
     
    } else {
      this.snackbar.showInfo(response._body.message, "Error");
    }
  });
   
    }
  }
  getActivityType(id: any) {
    const objRequest = {
      typeId: 8,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          debugger;
          this.ActivityType = parseresponse.Table4;
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
}

export class cls_addldm {
  constructor(){

  }
  date_of_posting: string= '';
  office_bearer: string= '';
  desc: string = '';
  title: string='';
  imageFile: string | File = ''; // Allow both string and File
  pdfFile: string | File = ''; // Allow both string and File
  imagePath:string='';
  pdfPath:string='';
  expected_outcome: string='';
  state_id:number = 0;
  activity_id:number=0;
  assembly_id:number = 0;
  village_id:number = 0;
  designation_id:number = 0;
  no_of_participants:number = 0;
  id:number=0;
  created_by:number=0;
}