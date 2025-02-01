 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import 'jquery';
import { dashboardService } from '../dashboard/dashboard.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';   
import { TranslateService } from '@ngx-translate/core'; 
import { FormControl ,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
declare var c3: any;
@Component({
  selector: 'app-sliders',
  standalone: true,
  
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './IOT-dashboard.component.html',
  styleUrl: './IOT-dashboard.component.scss'
})

export class IOTComponent {
  isLoggedIn:any='';
  userdetails:any={}; 
  userDetail:any={}; 
      
  constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
      this.userDetail = this.sharedService.getUserSession();
      
       
  }
 
  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    this.userdetails = JSON.parse(this.isLoggedIn)
     if(this.isLoggedIn!=null){ 
      this.LoadCharts();
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
  
  
  LoadCharts() {
    // First Chart - Bar Chart
    const barChart = c3.generate({
      bindto: '#Google-Analytics-Dashboard', 
      data: {
        columns: [
          ['Electricity', 11, 8, 22, 18, 19, 6, 17, 11, 17, 32, 9, 12],
          ['Water', 7, 7, 5, 7, 9, 12, 8, 22, 18, 19, 6, 17],
          ['Gas', 1, 13, 15, 8, 9, 12, 8, 18, 11, 17, 6, 12]
        ],
        type: 'bar',
        colors: {
          'Electricity': '#00BCD4',
          'Water': '#009688',
          'Gas': '#8BC34A'
        }
      },
      axis: {
        x: {
          type: 'category',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      },
      bar: {
        width: 5
      },
      legend: {
        show: true
      },
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
      }
    });

    // Second Chart - Donut Chart
    const donutChart = c3.generate({
      bindto: '#DayNight-Use',
      data: {
        columns: [
          ['Night', 65],
          ['Day', 35]
        ],
        type: 'donut',
        colors: {
          'Night': '#637aae',
          'Day': '#59c4bc'
        }
      },
      legend: {
        show: true
      },
      padding: {
        bottom: 0,
        top: 0
      }
    });
  }
   
}

 
