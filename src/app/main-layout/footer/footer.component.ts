import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'jquery';  
import { SharedService } from 'src/shared/Shared.Service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer', 
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit  {
  isLoggedIn:any='';
  ngOnInit() {  
   
    this.isLoggedIn = localStorage.getItem("cl_user"); 
}
  redirect_page(_pageTye:any){
    if(this.isLoggedIn==null)
      window.location.href = "/auth/login";
    else if(_pageTye=='CO')
    window.location.href = "/congress_organization";
    else if(_pageTye=='CL')
    window.location.href = "/congress_leaders";
    else if(_pageTye=='Activities')
    window.location.href = "/activity_list";
    else if(_pageTye=='Meetings')
    window.location.href = "/meetings";
    else if(_pageTye=='Trainings')
    window.location.href = "/meetings";
   }
}
