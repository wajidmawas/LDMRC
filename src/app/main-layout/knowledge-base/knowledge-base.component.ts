 
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
import { MatRadioModule } from '@angular/material/radio';
@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule,FormsModule,MatRadioModule], 
  templateUrl: './knowledge-base.component.html',
  styleUrl: './knowledge-base.component.scss'
})
export class KnowledgeBaseComponent {
  isLoggedIn:any='';
  userdetails:any={};
  DesignationLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  FiltersList: any = [];
  knowledgebase: any = [];
  knowledgebaseList: any = [];
  States: any = [];
  Districts: any = [];
  is_recommended: number = 0;
  selectedOption: number = 0;
   clsknowledge:cls_addknowledge=new cls_addknowledge();
   userDtail:any={};
  constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
      this.userDetail = this.sharedService.getUserSession();
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
      this.LoadUsers() ;
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }  
  ActivityDetail(actitem:any){

  }
  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        const file = input.files[0];
        this.clsknowledge.thumbnail_img = file; // Assign File object
        this.clsknowledge.imagePath = file.name; // Assign File object

      }
  }
  onDetailFileChange(event: any) {
    const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        const file = input.files[0];
        this.clsknowledge.details_img = file; // Assign File object
        this.clsknowledge.details_imagePath=file.name
      }
  }
  onVideoFileChange(event: any) {
    const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        const file = input.files[0];
        this.clsknowledge.videopath = file.name; // Assign File object
       
      }
  }
  CancelActivity()
  {
    this.clsknowledge = new cls_addknowledge(); // Reset form data
  }
  SaveActivity() { 
    var validate:boolean=false;
  
    // Perform client-side validation
    if (this.clsknowledge.title == undefined || this.clsknowledge.title == null || this.clsknowledge.title == '') {
      this.snackbar.showInfo("Please enter title", "Error");
      validate = true;
    } else if (this.clsknowledge.short_desc == undefined || this.clsknowledge.short_desc == null || this.clsknowledge.short_desc == '') {
      this.snackbar.showInfo("Please enter short description", "Error");
      validate = true;
    } else if (this.clsknowledge.description == undefined || this.clsknowledge.description == null || this.clsknowledge.description == '') {
      this.snackbar.showInfo("Please enter description", "Error");
      validate = true;
    } else if (this.clsknowledge.thumbnail_img == undefined || this.clsknowledge.thumbnail_img == null || this.clsknowledge.thumbnail_img == '') {
      this.snackbar.showInfo("Please select an image", "Error");
      validate = true;
    }
  debugger;
    if (!validate) {
      $(".page-loader-wrapper-review").show();
      const formData = new FormData();
      // Append form fields
      formData.append('title', this.clsknowledge.title);
      formData.append('date_posting', this.clsknowledge.date_posting);
      formData.append('author', this.clsknowledge.author);
      formData.append('activity_type', this.clsknowledge.activity_type);
      formData.append('short_desc', this.clsknowledge.short_desc);
      formData.append('description', this.clsknowledge.description);
      formData.append('is_recommended', this.clsknowledge.is_recommended.toString());
       formData.append('user_id', this.userdetails.user_id.toString());
      formData.append('id',this.clsknowledge.id.toString());
      formData.append('imagePath', this.clsknowledge.imagePath);
      formData.append('details_imagePath', this.clsknowledge.details_imagePath);
  
         // Append file only if it exists
         if (this.clsknowledge.thumbnail_img && this.clsknowledge.thumbnail_img instanceof File) {
          formData.append('thumbnail_img', this.clsknowledge.thumbnail_img);
        }
          // Append file only if it exists
          if (this.clsknowledge.details_img && this.clsknowledge.details_img instanceof File) {
            formData.append('details_img', this.clsknowledge.details_img);
          }
          formData.append('videopath', this.clsknowledge.videopath);
         
            
  this.service.Saveknowledge(formData).subscribe((res: any) => {
    setTimeout(() => {
      $(".page-loader-wrapper-review").hide();
    }, 500);
    var response = res;
    if (response.errorCode == "200") {
       this.snackbar.showSuccess(response.message, response.status);
      // setTimeout(() => {
      //   this.responseid=JSON.parse(response.response).Table[0].id;
      //   if(this.responseid==this.clsactivity.id)
      //   {
      //     this.clsactivity = new cls_addactivity(); // Reset form data
      //     window.location.href = "/profile";
      //   }
      //   this.clsactivity = new cls_addactivity(); // Reset form data
  
      // }, 3000);
     
    } else {
      this.snackbar.showInfo(response.message, "Error");
    }
  });
   
    }
  }
  showTab(tab_type:any){ 
    this.knowledgebase=this.knowledgebaseList; 
    if(tab_type=='Recommended')
      return this.knowledgebase=this.knowledgebase.filter((item: any) =>(item.is_recommended === true));
  else
      return this.knowledgebase=this.knowledgebase.filter((item: any) =>(item.type === tab_type));
  }
  viewDetails(access_token:any){
    window.location.href = "/user-profile/"+access_token;
  }
  onOptionChange() {  
    this.clsknowledge.is_recommended = this.selectedOption === 0 ? 0 : 1;
  }
  LoadUsers() {
    const objRequest = {
      typeId: 34,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.knowledgebase = parseresponse.Table; 
          this.knowledgebaseList = parseresponse.Table; 
          return this.knowledgebase=this.knowledgebase.filter((item: any) =>(item.type === 'Documents'));
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
   
  backtohome(){
    window.location.href = "/dashboard";
  }
}

export class cls_addknowledge {
  constructor(){

  }
  thumbnail_img: string | File = ''; // Allow both string and File
  details_img: string | File = ''; // Allow both string and File
  id:number=0;
  imagePath:string='';
  details_imagePath:string='';
  user_id:string='';
  title: string='';
  date_posting: string= '';
  author: string= '';
  activity_type: string= '';
  // videopath: string= '';
  videopath: string | File= '';

  short_desc: string = '';
  description: string = '';
  is_recommended:number=0;
}