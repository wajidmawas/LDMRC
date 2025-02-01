import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'jquery';  
import { SharedService } from 'src/shared/Shared.Service'; 
import { Router } from '@angular/router';
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
  constructor(public sharedService: SharedService,private router: Router) {
  
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
    // window.location.href = "/auth/login";
    this.router.navigate(['/auth/login']); // Navigate using Angular Router
  }
   profile(){
    window.location.href = "profile";
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
   else if(_pageTye=='LDM')
    window.location.href = "/leader_dev_mission";
    else if(_pageTye=='Activities')
    window.location.href = "/activity_list";
    else if(_pageTye=='Meetings')
    window.location.href = "/meetings";
    else if(_pageTye=='Trainings')
    window.location.href = "/trainings";
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
