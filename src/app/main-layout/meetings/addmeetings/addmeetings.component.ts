import { Component } from '@angular/core';

@Component({
  selector: 'addmeetings', 
  templateUrl: './addmeetings.component.html',
  styleUrl: './addmeetings.component.scss'
})
export class AddmeetingsComponent {
  isLoggedIn:any='';
  selectedOption: string = '1';
  isonline: boolean = false;
  ngOnInit() {  
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
  }
  backtohome(){
    window.location.href = "/meetings";
  }
  onOptionChange() {
    this.isonline = this.selectedOption === '0'; // Set true if value is '1', otherwise false
   
  }
}

