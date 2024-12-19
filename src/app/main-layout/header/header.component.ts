import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'jquery';  
import { SharedService } from 'src/shared/Shared.Service'; 
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  public isLightTheme = true;
  title = 'header';
  userDetails: any = {};
  isLoggedIn:any='';
  constructor(public sharedService: SharedService) {
  
  }
  
  ngOnInit() {  
   
      this.isLoggedIn = localStorage.getItem("cl_user");
      this.userDetails = JSON.parse(this.isLoggedIn)  
  }
  
 
  ngOnDestroy(): void {
      
  }
  
  logout() {
    localStorage.removeItem("cl_user");
    window.location.href = "/dashboard";
  }
  login(){
    window.location.href = "/auth/login";
  }
   profile(){
    window.location.href = "profile";
   }
 ngAfterViewInit(): void {
    
$('.hamburger-menu').on('click', function() {
  $('.hamburger-menu .bar').toggleClass('animate');
  if($('body').hasClass('open-menu')){
      $('body').removeClass('open-menu');
  }else{
      $('body').toggleClass('open-menu');
  }
});
 }
 

}
