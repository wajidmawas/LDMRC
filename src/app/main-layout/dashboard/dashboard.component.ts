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
import { map, startWith, Subject, takeUntil } from 'rxjs';
declare var $: any;
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'dashboard';

  @ViewChild('tableExport', { static: false }) table: any; // Reference to the HTML table element

  
  userDetail:any={};
      
  isLoggedIn:any='';
    
  currentDateTime:string ='';
  private _onDestroy = new Subject<void>(); 
constructor(public sharedService: SharedService) {

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
  }

  gotoMeetings(){
    window.location.href = "/meetings";
  }
  addmeeting(){
    window.location.href = "/meetings/addmeetings";
  }


  ngAfterViewInit(): void {
    $('.owl-carousel').owlCarousel({
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
    
  }


ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

 

}

 