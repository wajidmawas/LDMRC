 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { dashboardService } from '../dashboard/dashboard.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';   
import { TranslateService } from '@ngx-translate/core'; 
import { FormControl ,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
@Component({
  selector: 'app-sliders',
  standalone: true,
  
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './sliders.component.html',
  styleUrl: './sliders.component.scss'
})

export class SlidersComponent {
  isLoggedIn:any='';
  userdetails:any={}; 
  userDetail:any={}; 
  Users: any = [];
  images: any[] = []; 
  user_id:number=0;
  UsersList: any = []; 
   clsactivity:cls_addactivity=new cls_addactivity();
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
      this.LoadSlider(0);
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }
  setSelectedActivity(uid:number){
    this.user_id=uid;
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
  
  DeleteSlider() { 
    const objRequest = {
      typeId: 45,
      userid: 0,
      filterId: this.user_id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
          window.location.reload();
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  
  saveslider(){ 
 $(".page-loader-wrapper-review").show();
    const formData = new FormData();
    // Append form fields
    formData.append('title', this.clsactivity.title);  
    formData.append('display_order',this.clsactivity.display_order.toString()); 
    formData.append('id' , this.clsactivity.id.toString());
    formData.append('user_id', this.userdetails.user_id.toString());
    formData.append('details_imagePath', this.clsactivity.details_img);
      if (this.clsactivity.details_imagePath && this.clsactivity.details_imagePath instanceof File) {
        formData.append('details_img', this.clsactivity.details_imagePath);
      }
this.service.SaveSlider(formData).subscribe((res: any) => {
  setTimeout(() => {
    $(".page-loader-wrapper-review").hide();
  }, 500);
  var response = res;
  if (response.errorCode == "200") {
     this.snackbar.showSuccess("Successfully Updated","Success"); 
     setTimeout(() => {
      window.location.reload();
    }, 2000);
   
  } else {
    this.snackbar.showInfo(response.message, "Error");
  }
});
  }
   
  onFileChange(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.details_imagePath = file; // Assign File object
    }
} 
  backtohome(){
    window.location.href = "/dashboard";
  }
}


export class cls_addactivity {
  constructor(){

  }
  title: string=''; 
  display_order:number = 0;
  details_imagePath: string | File = '';
  user_id: number=0;
  id:number =0;
  details_img:string=''
}
