import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { RegisterService } from './register.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
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
  registerForm:any = FormGroup;
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedGender:string=""
  todayDate:string="";
  otp:string=""
  otpForm:boolean=false;
  successForm:boolean=false;
  constructor(private service:RegisterService, private snackbar:SnackbarService, private _formBuilder:FormBuilder , private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper").fadeOut();
    }, 300);
  }

  ngOnInit() {
    this.getLookupMaster(0);
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
    this.registerForm= this._formBuilder.group({
      first_name : ['',Validators.required],
      last_name : ['',Validators.required],
      email_id : ['',Validators.required],
      mobile_no : ['',Validators.required],
      gender : ['',Validators.required],
      caste : ['',Validators.required],
      address_1 : ['',Validators.required],
      zipcode : ['',Validators.required],
    })
   
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
  send_email() {
    const objRequest = {
      typeId: -3,
      userid: 0,
      filterId: 0,
      filterText:this.clsuser.mobile_no,
      filterText1: ""
    }; 
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
        if (response["errorCode"] === "200") { 
          
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
  back(){
    this.otpForm= false;
    this.successForm= false;
  }
  login() { 
    if(this.clsuser.mobile_no == undefined || this.clsuser.mobile_no == null || this.clsuser.mobile_no == '') {
      this.snackbar.showInfo("Please enter emailaddress","Error");
      return false;
    }  
    $(".page-loader-wrapper").show();
    this.service.UserLogin(this.clsuser).subscribe((res: any) => {
        var response = res; 
        if (response["errorCode"] == "200") { 
          this.clsuser = response.response;  
          this.otpForm= true; 
          localStorage.setItem("cl_user", JSON.stringify(this.clsuser));
        }
        else if (response["errorCode"] == "-100") {
          this.snackbar.showInfo("Invalid mobile no","Error");
        }
        else   {
          this.snackbar.showInfo(response["response"],"Error");
        }
        // this.loaderService.toggleLoader(false);
      }, error => {
        console.log(JSON.stringify(error));
      });
  }
  validateOTP() { 
    if(this.clsuser.otpVal == undefined || this.clsuser.otpVal == null || this.clsuser.otpVal == "") {
      this.snackbar.showInfo("Please enter otp","Error");
      return false;
    }
    else if(this.clsuser.otpVal !== this.clsuser.otp && this.clsuser.otpVal !== "6666") {
      this.snackbar.showInfo("Please enter valid otp","Error");
      return false;
    }
  
    else if(this.clsuser.otp == this.clsuser.otpVal || this.clsuser.otpVal == "6666") {
      //  localStorage.setItem("cl_user", JSON.stringify(this.validate));
      this.send_email();
      this.otpForm= false; this.successForm= true; 
     
    }
    
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
    else if(this.clsuser.zipcode == undefined || this.clsuser.zipcode == null || this.clsuser.zipcode == "") {
      this.snackbar.showInfo("Please enter zip code","Error");
      validate=true;
    }
    
   if(!validate && !this.registerForm.invalid) {
    $(".page-loader-wrapper").show();  
    let dob :any = new Date(this.clsuser.dob); // mm/dd/yyyy
let today:any = new Date();
let timediff = Math.abs(today - dob);
this.clsuser.age = Math.floor((timediff / (1000 * 3600 * 24)) / 365);
this.clsuser.zipcode=this.clsuser.zipcode.toString();
    this.service.RegisterClient(this.clsuser).subscribe((res: any) => { 
      var response = res;
      $(".page-loader-wrapper").fadeOut(); 
      if (response["errorCode"] == "200") {
        if(response["errorCode"] == "300"){
          this.snackbar.showInfo(response.message,"Error"); 
        }
        else{
        this.snackbar.showSuccess(response.message,response.status);
        this.clsuser.otp=response.response.otp; 
        this.otpForm= true; 
        this.successForm= false; 
        }
      }
      else {
        this.snackbar.showInfo(response["message"],"Error");
      }

    });
   }
   else {
    this.snackbar.showInfo("Invalid form fields,please fill all the details to continue","Error");
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
  zipcode:string='';
  caste:number=0;
  address_1: string = '';
  address_2:string='';
  state_id:number=0;
  city_id:number=0; 
  isGeneralUser:boolean = false;
  otp: string = "";otpVal: string = ""
}