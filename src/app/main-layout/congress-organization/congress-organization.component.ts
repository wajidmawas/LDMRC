import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import 'jquery';
@Component({
  selector: 'app-congress-organization',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule], 
  templateUrl: './congress-organization.component.html',
  styleUrl: './congress-organization.component.scss'
})
export class CongressOrganizationComponent {
  isLoggedIn:any='';

  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
     
   
  }

  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
}
