import { Component } from '@angular/core'; 

@Component({
  selector: 'meetings',
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent {
  isLoggedIn:any ='';
  ngOnInit() {  
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
  }

  backtohome(){
    window.location.href = "/dashboard";
  }

  addmeeting(){
    window.location.href = "/meetings/addmeetings";
  }
}
