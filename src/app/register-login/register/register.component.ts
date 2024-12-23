import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { RegisterService } from './register.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class registerComponent implements OnInit, AfterViewInit {
  title = 'register';
  userDtail: any = {}; countries: any = []; navigation: any;
  clsuser:cls_register=new cls_register();
  selectedOption: string = '1';
  isGeneralUserstatus: boolean = false;
  states: any = []; cities: any = [];
  casteList:any = [];
  selectedCaste: number | null = null;
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedGender:string=""
  constructor(private service:RegisterService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
  }

  ngOnInit() {
    this.getLookupMaster(0);
   
  }
  ngAfterViewInit() {

    $('input[name^="number"]').on('keypress keyup blur', function (event: any) {
      $(this).val(($(this) as any).val().replace(/[^\d].+/, ""));
      if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
      }

    });
  }
  onOptionChange() {
    this.isGeneralUserstatus = this.selectedOption === '2'; // Set true if value is '1', otherwise false
   
  }
  onCasteChange(event: any): void {
    this.selectedCaste = event.target.value; 
  }
  onstateChange(event: any): void {
    this.selectedState = event.target.value; 
    this.getCities(event.target.value) 
  }
  oncityChange(event: any): void {
    this.selectedCity = event.target.value; 
  }
  ongenderChange(event: any): void {
    this.selectedGender = event.target.value; 
    console.log(this.selectedGender)
  }
  getLookupMaster(id: any) {
    const objRequest = {
      typeId: 1,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.casteList = parseresponse.Table;
          this.states = parseresponse.Table1;
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  
  getCities(id: any) {
    const objRequest = {
      typeId: 2,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
    console.log(JSON.stringify(objRequest));
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
       
        if (response["errorCode"] === "200") { 
          this.cities = parseresponse.Table
         console.log("Cities" + JSON.stringify(this.cities))
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }

  register() {
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var validate:boolean=false;
    if(this.clsuser.first_name == undefined || this.clsuser.first_name == null || this.clsuser.first_name == '') {
      this.snackbar.showInfo("Please enter your first name","Error");
      validate=true;
    }
    else if(this.clsuser.last_name == undefined || this.clsuser.last_name == null || this.clsuser.last_name == '') {
      this.snackbar.showInfo("Please enter your last name","Error");
      validate=true;
    }
    else if (this.clsuser.email_id != undefined && this.clsuser.email_id!= null && this.clsuser.email_id != "" && !reg.test(this.clsuser.email_id)) {
      this.snackbar.showInfo("Please enter correct email", 'Error');
      validate=true;
    } 
    else if(this.clsuser.mobile_no !== undefined && this.clsuser.mobile_no !== '' && (this.clsuser.mobile_no.length <=9 || this.clsuser.mobile_no.length > 10)) {
      this.snackbar.showInfo("Please enter correct contact no","Error");
      validate=true;
    }
    else if(this.clsuser.dob == undefined || this.clsuser.dob == null || this.clsuser.dob == '') {
      this.snackbar.showInfo("Please select date of birth","Error");
      validate=true;
    }
    else if(this.clsuser.age == undefined || this.clsuser.age == null) {
      this.snackbar.showInfo("Please enter your age","Error");
      validate=true;
    }
    else if(this.clsuser.gender == undefined || this.clsuser.gender == null || this.clsuser.gender == '') {
      this.snackbar.showInfo("Please select your gender","Error");
      validate=true;
    }
    else if(this.clsuser.caste == undefined || this.clsuser.caste == null || this.clsuser.caste == 0) {
      this.snackbar.showInfo("Please select your caste","Error");
      validate=true;
    }
    else if(this.clsuser.address_1 == undefined || this.clsuser.address_1 == null || this.clsuser.address_1 == '') {
      this.snackbar.showInfo("Please enter your address","Error");
      validate=true;
    }
    else if(this.clsuser.state_id == undefined || this.clsuser.state_id == null || this.clsuser.state_id == 0) {
      this.snackbar.showInfo("Please select state","Error");
      validate=true;
    }
    else if(this.clsuser.city_id == undefined || this.clsuser.city_id == null || this.clsuser.city_id == 0) {
      this.snackbar.showInfo("Please select city","Error");
      validate=true;
    }
    
   if(!validate) {
    $(".page-loader-wrapper-review").show(); 
    this.service.RegisterClient(this.clsuser).subscribe((res: any) => {
      setTimeout(() => {
        $(".page-loader-wrapper-review").hide();
      }, 500);
      var response = res;
      if (response["errorCode"] == "200") {
        this.snackbar.showSuccess(response.message,response.status);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      else {
        this.snackbar.showInfo(response["message"],"Error");
      }

    });
   }
    
  }
}


export class cls_register {
  constructor() {
  }
  first_name: string='';
  last_name:string='';
  email_id:string=''; 
  mobile_no:string='';
  age:number=0;
  dob:string = '';
  gender:string='';
  caste:number=0;
  address_1: string = '';
  address_2:string='';
  state_id:number=0;
  city_id:number=0; 
  isGeneralUser:boolean = false;
  otp: string = ""
}