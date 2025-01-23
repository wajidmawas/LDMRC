import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';  
import { dashboardService } from './dashboard.service'; 
import { TranslateService } from '@ngx-translate/core';  
import dayGridPlugin from '@fullcalendar/daygrid' 
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs';

declare var $: any;
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  videos = [
    {
      thumbnail: '../../../assets/images/communcation/image4.png',
      title: 'Shri KC Venugopal | Press Conference | Kerala',
      date: '23 Dec 2024',
      description: 'Press Conference by Shri KC Venugopal',
      link: 'https://example.com/video1'
    },
    {
      thumbnail: '../../../assets/images/communcation/image5.png',
      title: 'Congress party briefing by Shri Pawan Khera at AIC',
      date: '23 Dec 2024',
      description: 'Briefing on major events by Pawan Khera',
      link: 'https://example.com/video2'
    },
    {
      thumbnail: '../../../assets/images/communcation/image6.png',
      title: 'Press Conference | AICC HQ | Rahul Gandhi',
      date: '23 Dec 2024',
      description: 'Special conference by Rahul Gandhi',
      link: 'https://example.com/video3'
    },
    {
      thumbnail: '../../../assets/images/communcation/image7.png',
      title: 'Press Conference | AICC HQ | Rahul Gandhi',
      date: '23 Dec 2024',
      description: 'Special conference by Rahul Gandhi',
      link: 'https://example.com/video3'
    },  {
      thumbnail: '../../../assets/images/communcation/image8.png',
      title: 'Press Conference | AICC HQ | Rahul Gandhi',
      date: '23 Dec 2024',
      description: 'Special conference by Rahul Gandhi',
      link: 'https://example.com/video3'
    },  {
      thumbnail: '../../../assets/images/communcation/image9.png',
      title: 'Press Conference | AICC HQ | Rahul Gandhi',
      date: '23 Dec 2024',
      description: 'Special conference by Rahul Gandhi',
      link: 'https://example.com/video3'
    },
    // Add more video objects as needed
  ];
  images: any[] = [];
  title = 'dashboard';
  Activities: any = [];Communications: any = [];
  TopCommunications: any = [];
  PhysicalMetting: any = [];
  meetings: any = [];
  Mymetting: Meeting[] = [];
  userid: string | null = ''; // Replace with actual logic to fetch user ID

  userdetails:any={};
  @ViewChild('tableExport', { static: false }) table: any; // Reference to the HTML table element

  
  userDetail:any={};
      
  isLoggedIn:any='';
  customOptions = {
    loop: false,
    margin: 20,
    center:true,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 }
    }
  };
  currentDateTime:string ='';
  private _onDestroy = new Subject<void>(); 
constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
  setTimeout(() => {
    $(".page-loader-wrapper-review").fadeOut();
  }, 300);
    this.userDetail = this.sharedService.getUserSession();
    
    var year  = new Date().getFullYear();
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'long', // Full month name
      day: 'numeric',
      weekday: 'long', // Full day name
    };
    this.currentDateTime = new Intl.DateTimeFormat('en-US', options).format(now);
}
 
 
  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    if(this.isLoggedIn!=null)
    {
      this.userdetails = JSON.parse(this.isLoggedIn)
      this.userid=this.userdetails.user_id;
      
      //this.LoadActivity(this.userdetails.user_id,'');
      this.LoadScheduler(this.userdetails.user_id);
  
      this.getmymetting(this.userdetails.user_id)
    }
    this.LoadActivity(0,'');
    this.LoadSlider(0);
   
  }
  redirect_page(_pageTye:any){
    if(this.isLoggedIn==null)
      window.location.href = "/auth/login";
    else if(_pageTye=='CO')
    window.location.href = "/congress_organization";
    else if(_pageTye=='CL')
    window.location.href = "/congress_leaders";
  else if(_pageTye=='EL')
    window.location.href = "/election_members";
   else if(_pageTye=='KB')
    window.location.href = "/knowledge_base";
    else if(_pageTye=='Activities')
    window.location.href = "/activity_list";
   else if(_pageTye=='LDM')
    window.location.href = "/leader_development_mission";
  else if(_pageTye=='profile')
    window.location.href = "/profile";
    else if(_pageTye=='Meetings')
    window.location.href = "/meetings";
    else if(_pageTye=='Trainings')
    window.location.href = "/meetings";
   }
  getmymetting(id: number) { 
    const objRequest = {
      typeId: 28,
      userid: id,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
         const parseresponse = JSON.parse(response.response); 
 const metting = parseresponse.Table;
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
  LoadActivity(id: any,filterText:string) {
    const objRequest = {
      typeId: 30,
      userid: 0,
      filterId: id,
      filterText: filterText,
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.Activities = parseresponse.Table;
          this.Communications = parseresponse.Table1;
          this.TopCommunications = parseresponse.Table2;
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
  ActivityDetail(Activity: any) { 
    console.log('Activity:', Activity);
    if (Activity && Activity.code) {
      this.router.navigate([`activity_detail`, Activity.code]);
    } else {
      console.error('Invalid Activity object or missing ID');
    }
  }
  LoadScheduler(id: any) {
    const objRequest = {
      typeId: 24,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  

        var parseresponse = JSON.parse(response.response);  
        if (response["errorCode"] === "200") {
          this.meetings=parseresponse.Table1;
          this.PhysicalMetting = parseresponse.Table;
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
  gotoMeetings(){
    if(this.isLoggedIn!=null)
    {
    window.location.href = "/meetings";
    }
    else{
      window.location.href = "/auth/login";
    }
  }
  addmeeting(){ 
    if(this.isLoggedIn!=null)
    {
    window.location.href = "/addmeetings";
    }
    else{
      window.location.href = "/auth/login";
    }
  }


  ngAfterViewInit(): void {
    $('.loop').owlCarousel({
      loop:true,
      margin:20,
      responsiveClass:true,
      nav:true,
      autoplay:false,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
      responsive:{
          0:{
              items:1,
              nav:false
          },
          600:{
              items:3,
              nav:false
          },
          1000:{
              items:5,
              nav:true, 
          }
      }
    });
    $('.loop2').owlCarousel({
      loop:false,
      center: true,
      margin:20,
      responsiveClass:true,
      nav:true,
      autoplay:false, 
      responsive:{
          0:{
              items:2,
              nav:false
          },
          600:{
              items:2,
              nav:false
          },
          1000:{
              items:4,
              nav:true, 
          } 
      }
    });
  }


ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

LoadSlider(id:any) { 
  const objRequest = {
    typeId: 21,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => {  
       const parseresponse = JSON.parse(response.response); 
       this.images = parseresponse.Table;
    },
    error: (error: any) => {
      console.error("API call failed:", error);
    },
    complete: () => {
      console.log("API call completed.");
    }
  });
}

}

export interface Meeting {
  title: string;
  Day: string;
  Date: string;
  time: string;
  Meeting: string;
  organizer: string;
  DurationInNightsAndDays: string;

}
 