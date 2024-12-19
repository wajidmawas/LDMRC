import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
 
  userDtail:any={};
  userdetails:any={};
constructor(public sharedService: SharedService, private titleService: Title) {
      
    this.titleService.setTitle("AICC - Profile");
   
    
    
}

ngOnDestroy(): void {
    
}
logout() {
  localStorage.removeItem("cl_user");
  window.location.href = "/dashboard";
}
ngOnInit(): void { 
  $(".page-loader-wrapper").fadeOut();  
  this.userDtail = localStorage.getItem("cl_user");
  this.userdetails = JSON.parse(this.userDtail)
console.log("UserDetails",this.userdetails)
}

ngAfterViewInit(): void {
  
}
}