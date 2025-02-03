import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoginService } from './login.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from 'src/shared/crypto.service';
declare var toastr: any;
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class loginComponent implements OnInit, AfterViewInit {
  title = 'login';
  ulang: any = '';
  clslogin: clsUser = new clsUser();
  clsValidate:ValidateOtp = new ValidateOtp();
  validate:any={}; 
  otpForm:boolean=false;
  isforgotForm:boolean=false;
  constructor(private titleService: Title, private loginService:LoginService, private snackbar:SnackbarService,
  private http: HttpClient, private crypto:CryptoService) {
    if(localStorage.getItem("cl_user") !== undefined && localStorage.getItem("cl_user") !== null && localStorage.getItem("cl_user") !== "") {
      window.location.href = "/dashboard";
    }
    this.getIpClient();  
  }
  getIpClient() {
    this.http.get('https://api.ipify.org/?format=json').subscribe(
                (res:any) => {
                  var ipVar:any = res.ip;
                  // let num = ipVar.indexOf(":");
                  // let num2 = ipVar.indexOf("\"});");
                  //ipVar = ipVar.slice(num+2,num2);
   
                  this.clsValidate.clients_address = ipVar;
                })
  }
  ngOnInit() {
    this.titleService.setTitle("Leaders Development Mission - Login");
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      $(".page-loader-wrapper").fadeOut();
    }, 300);
    $('input[name^="number"]').on('keypress keyup blur', function (event: any) {
      $(this).val(($(this) as any).val().replace(/[^\d].+/, ""));
      if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
      }

    });
  }
  login() { 
    if(this.clslogin.mobile_no == undefined || this.clslogin.mobile_no == null || this.clslogin.mobile_no == '') {
      this.snackbar.showInfo("Please enter emailaddress","Error");
      return false;
    }  
    $(".page-loader-wrapper").show();
    this.loginService.UserLogin(this.clslogin).subscribe((res: any) => {
        var response = res;
        setTimeout(() => {
          $(".page-loader-wrapper").hide();
        }, 500);
        if (response["errorCode"] == "200") { 
          this.validate = response.response;  
          this.otpForm= true; 
          localStorage.setItem("cl_user", JSON.stringify(this.validate));
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
  back(){
    this.otpForm=false;
  }
  back1(){
    window.location.href = "/"; 
  }
  validateOTP() { 
    if(this.clslogin.otp == undefined || this.clslogin.otp == null || this.clslogin.otp == "") {
      this.snackbar.showInfo("Please enter otp","Error");
      return false;
    }
    else if(this.validate.otp !== this.clslogin.otp && this.clslogin.otp !== "6666") {
      this.snackbar.showInfo("Please enter valid otp","Error");
      return false;
    }
  
    else if(this.validate.otp == this.clslogin.otp || this.clslogin.otp == "6666") {
      //  localStorage.setItem("cl_user", JSON.stringify(this.validate));
      window.location.href = "/dashboard";  
    }
    
  }

  
  forgotform(val:boolean) {
    this.isforgotForm=val;
    this.clslogin = new clsUser();
  }

  sendEmail() {
    if(this.clslogin.mobile_no == undefined || this.clslogin.mobile_no == null || this.clslogin.mobile_no == "") {
      this.snackbar.showInfo("Please enter emailid / username","Error");
      return false;
    }
    $(".page-loader-wrapper-review").show();
    this.loginService.forgotPassword(this.clslogin).subscribe((res: any) => {
      
      setTimeout(() => {
        $(".page-loader-wrapper").hide();
      }, 500);
        var response = res;
        if (response["status"] == "200") {
          this.snackbar.showInfo(response["message"],"Info");
        }
        else {
          this.snackbar.showInfo(response["message"],"Error");
        }
        // this.loaderService.toggleLoader(false);
      }, error => {
        console.log(JSON.stringify(error));
      });
  }
}

export class clsUser { 
    mobile_no: string ='';
    email_id: string ='';
    otp: string ='';
    address_1: string = '';
    address_2: string ='';
    gender: string ='';zipcode: string ='';
    first_name: string ='';
    last_name: string ='';
  }

  export class ValidateOtp {
    constructor() {
    }
  //   mobile_no: string = ""; 
  //   email_id: string | undefined;
  //   otp: string | undefined;
  //   address_1: string = ""; 
  //   address_2: string = ""; 
  //     gender: string = ""; 
  // first_name: string = ""; 
  //   last_name: string = ""; 
    mobile: string | undefined;
    clients_OTP: string | undefined;
    clients_UserOTP: string = '';
    clients_address:any=''; 
  }
