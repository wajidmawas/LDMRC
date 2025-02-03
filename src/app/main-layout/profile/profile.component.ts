import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from './profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('activityModal') activityModal!: ElementRef;
  
  user_id: number = 0;
  selectedActivity: any = null;
  selectedProfession: any = null;
  cls_register:cls_register=new cls_register();
  Activities:any=[];ActivitiesList:any=[];
  clsactivity:cls_addactivity=new cls_addactivity();
  
  //  professions: cls_addprofession[] = [];
 
    professions: cls_addprofession[] = [new cls_addprofession()];
  
  // clsprofession: cls_addprofession = new cls_addprofession();
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedDesignation:number | null = null;

  selectedVillage:number | null = null;
  filename: any | null = null;
  ActivitiesDetail:any=[];
  states: any = []; cities: any = [];casteList: any = [];ActivityType: any = [];DesiginationList: any = [];
  userDtail:any={};ProfessionList: any = [];
  ElectionData: any = [];
  userdetails:any={};
  villages:any=[];
  todayDate:string="";
  titlesearch:string='';
  registerForm:any = FormGroup;
//#add activity 
activityId: string | null = null;
responseid:any=[];
//#end activity



constructor( private router: Router,private _formBuilder:FormBuilder ,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
    this.titleService.setTitle("Leaders Development Mission - Profile");
   
}

ngOnDestroy(): void {
    
}
logout() {
  localStorage.removeItem("cl_user");
  window.location.href = "/dashboard";
}
ngOnInit(): void { 
  $(".page-loader-wrapper").fadeOut();  
  this.userDtail = localStorage.getItem("cl_user");
  this.userdetails = JSON.parse(this.userDtail) 
this.getLookupMaster(0);
this.getActivityType(0);
this.getDesigination(0); 
 this.LoadActivity(this.userdetails.user_id,this.titlesearch);
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
EditProfile(){
    this.cls_register.first_name=this.userdetails.first_name;
    this.cls_register.last_name=this.userdetails.last_name;
    this.cls_register.email_id=this.userdetails.email_id;
    this.cls_register.mobile_no=this.userdetails.mobile_no;
    this.cls_register.address_1=this.userdetails.address_1;
    this.cls_register.address_2=this.userdetails.address_2;
    this.cls_register.state_id=this.userdetails.state_id;
    this.getCities( this.cls_register.state_id) 
    this.cls_register.city_id=this.userdetails.city_id;
    this.cls_register.caste=this.userdetails.caste; 
    this.cls_register.dob=this.userdetails.dob.split('T')[0];
    this.cls_register.gender=this.userdetails.gender;
    this.cls_register.zipcode=this.userdetails.zipcode;
}
ngAfterViewInit(): void {
  
}
addactivity(){
    this.router.navigate([`/profile/addactivity`, 0]);
}

UpdateProfile(){ 
  $(".page-loader-wrapper-review").show();
     const formData = new FormData();
     // Append form fields 
     formData.append('upload_type', "");
     formData.append('imagePath', "");
     formData.append('id', this.userdetails.user_id.toString());
     formData.append('imageFile', this.clsactivity.details_img); 
 this.service.uploadprofileimg(formData).subscribe((res: any) => { 
   var response = res;
   if (response.errorCode == "200") {
      this.snackbar.showSuccess("Successfully Updated","Success"); 
      var parseresponse = JSON.parse(response.response);   
     this.userdetails.image_path=parseresponse.Table[0].image_path
     
    
   } else {
     this.snackbar.showInfo(response.message, "Error");
   }
 });
   }

   UpdateUser(){
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var validate:boolean=false;  
    if(this.cls_register.first_name == undefined || this.cls_register.first_name == null || this.cls_register.first_name == '') {
      this.snackbar.showInfo("Please enter your first name","Error");
      validate=true;
    }
    else if(this.cls_register.last_name == undefined || this.cls_register.last_name == null || this.cls_register.last_name == '') {
      this.snackbar.showInfo("Please enter your last name","Error");
      validate=true;
    }
    else if (this.cls_register.email_id != undefined && this.cls_register.email_id!= null && this.cls_register.email_id != "" && !reg.test(this.cls_register.email_id)) {
      this.snackbar.showInfo("Please enter correct email", 'Error');
      validate=true;
    } 
    else if(this.cls_register.mobile_no !== undefined && this.cls_register.mobile_no !== '' && (this.cls_register.mobile_no.length <=9 || this.cls_register.mobile_no.length > 10)) {
      this.snackbar.showInfo("Please enter correct contact no","Error");
      validate=true;
    }
    else if(this.cls_register.dob == undefined || this.cls_register.dob == null || this.cls_register.dob == '') {
      this.snackbar.showInfo("Please select date of birth","Error");
      validate=true;
    }
    
    else if(this.cls_register.gender == undefined || this.cls_register.gender == null || this.cls_register.gender == '') {
      this.snackbar.showInfo("Please select your gender","Error");
      validate=true;
    }
    else if(this.cls_register.caste == undefined || this.cls_register.caste == null || this.cls_register.caste == 0) {
      this.snackbar.showInfo("Please select your caste","Error");
      validate=true;
    }
    else if(this.cls_register.address_1 == undefined || this.cls_register.address_1 == null || this.cls_register.address_1 == '') {
      this.snackbar.showInfo("Please enter your address","Error");
      validate=true;
    }
    else if(this.cls_register.state_id == undefined || this.cls_register.state_id == null || this.cls_register.state_id == 0) {
      this.snackbar.showInfo("Please select state","Error");
      validate=true;
    }
    else if(this.cls_register.city_id == undefined || this.cls_register.city_id == null || this.cls_register.city_id == 0) {
      this.snackbar.showInfo("Please select city","Error");
      validate=true;
    }
    else if(this.cls_register.zipcode == undefined || this.cls_register.zipcode == null || this.cls_register.zipcode == "") {
      this.snackbar.showInfo("Please enter zip code","Error");
      validate=true;
    }
    
   if(!validate && !this.registerForm.invalid) {
    $(".page-loader-wrapper").show();  
    let dob :any = new Date(this.cls_register.dob); // mm/dd/yyyy
let today:any = new Date();
let timediff = Math.abs(today - dob);
this.cls_register.age = Math.floor((timediff / (1000 * 3600 * 24)) / 365);
this.cls_register.zipcode=this.cls_register.zipcode.toString();
    this.service.UpdateUser(this.cls_register).subscribe((res: any) => { 
      var response = res;
      $(".page-loader-wrapper").fadeOut(); 
      if (response["errorCode"] == "200") {
        if(response["errorCode"] == "300"){
          this.snackbar.showInfo(response.message,"Error"); 
        }
        else{
        this.snackbar.showSuccess(response.message,response.status);
        localStorage.setItem("cl_user", JSON.stringify(response.response));
        this.userDtail = localStorage.getItem("cl_user");
        this.userdetails = JSON.parse(this.userDtail) 
        setTimeout(() => {
          window.location.reload()
        }, 2000);
     
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
      
searchactivity(){ 
   
  this.Activities=this.ActivitiesList;
  if(this.titlesearch!=null && this.titlesearch!=undefined && this.titlesearch!=""){
    var list=this.Activities.filter((item: any) =>( 
    item.title.toLowerCase().includes(this.titlesearch.toLowerCase()) ||
    item.Author.toLowerCase().includes(this.titlesearch.toLowerCase()) ));
    this.Activities=list;
  }

}
onstateChange(event: any): void {
  this.selectedState = event.target.value; 
  this.getCities(event.target.value) 
}
oncityChange(event: any): void {
  this.selectedCity = event.target.value; 
  this.getvillages(event.target.value,this.selectedState);
}
onvillageChange(event: any): void {
  this.selectedVillage = event.target.value; 
}
onActvitytypeChange(event: any): void {
  this.selectedActvity = event.target.value; 
}
onDesignationChange(event: any): void {
  this.selectedDesignation = event.target.value; 
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
     
      if (response["errorCode"] === "200") { 
        var parseresponse = JSON.parse(response.response);  
        this.cities = parseresponse.Table 
        setTimeout(() => {
          this.cls_register.city_id=this.userdetails.city_id;
        }, 500);
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
getvillages(id: any,state :any) { 
  const objRequest = {
    typeId: 5,
    userid: 0,
    filterId: state,
    filterText: String(id),
    filterText1: ""
  };
  console.log(JSON.stringify(objRequest));
  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => {  
      var parseresponse = JSON.parse(response.response); 
     
      if (response["errorCode"] === "200") { 
        this.villages = parseresponse.Table
       console.log("villages" + JSON.stringify(this.villages))
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
        this.states = parseresponse.Table1;
        this.casteList = parseresponse.Table;
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
getActivityType(id: any) {
  const objRequest = {
    typeId: 18,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response); 
      if (response["errorCode"] === "200") {
        this.ActivityType = parseresponse.Table;
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
getDesigination(id: any) {
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
        this.DesiginationList = parseresponse.Table2;
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
 
LoadActivity(id: any,filterText:string) {
  const
   objRequest = {
    typeId: 4,
    userid: 0,
    filterId: id,
    filterText: filterText,
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => {  
     
      if (response["errorCode"] === "200") {
        var parseresponse = JSON.parse(response.response); 
        this.Activities = parseresponse.Table2;
        this.ActivitiesList = parseresponse.Table2;
        this.ProfessionList = parseresponse.Table1;
        this.ElectionData = parseresponse.Table3;
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
SaveActivity() { 
  var validate:boolean=false;

  // Perform client-side validation
  if (this.clsactivity.title == undefined || this.clsactivity.title == null || this.clsactivity.title == '') {
    this.snackbar.showInfo("Please enter title", "Error");
    validate = true;
  } else if (this.clsactivity.short_desc == undefined || this.clsactivity.short_desc == null || this.clsactivity.short_desc == '') {
    this.snackbar.showInfo("Please enter short description", "Error");
    validate = true;
  } else if (this.clsactivity.description == undefined || this.clsactivity.description == null || this.clsactivity.description == '') {
    this.snackbar.showInfo("Please enter description", "Error");
    validate = true;
  } else if (this.clsactivity.thumbnail_img == undefined || this.clsactivity.thumbnail_img == null || this.clsactivity.thumbnail_img == '') {
    this.snackbar.showInfo("Please select an image", "Error");
    validate = true;
  } 
  else if (this.clsactivity.details_img == undefined || this.clsactivity.details_img == null || this.clsactivity.details_img == '') {
    this.snackbar.showInfo("Please select an detail image", "Error");
    validate = true;
  } 
  if (!validate) {
    $(".page-loader-wrapper-review").show();
    const formData = new FormData();
    // Append form fields
    formData.append('title', this.clsactivity.title);
    formData.append('date_posting', this.clsactivity.date_posting);
    formData.append('activity_type', this.clsactivity.activity_type.toString());
    formData.append('no_of_participants', this.clsactivity.no_of_participants.toString());
    formData.append('state_id', this.clsactivity.state_id.toString());
    formData.append('city_id', this.clsactivity.city_id.toString());
    formData.append('village_id', this.clsactivity.village_id.toString());
    formData.append('short_desc', this.clsactivity.short_desc);
    formData.append('description', this.clsactivity.description);
    formData.append('user_id', this.userdetails.user_id.toString());
    formData.append('friendly_url',this.clsactivity.friendlyurl.toString());
    formData.append('id',this.clsactivity.id.toString());

       // Append file only if it exists
       if (this.clsactivity.thumbnail_img && this.clsactivity.thumbnail_img instanceof File) {
        formData.append('thumbnail_img', this.clsactivity.thumbnail_img);
      }
      if (this.clsactivity.details_img && this.clsactivity.details_img instanceof File) {
        formData.append('details_img', this.clsactivity.details_img);
      }
this.service.SaveActivity(formData).subscribe((res: any) => {
  setTimeout(() => {
    $(".page-loader-wrapper-review").hide();
  }, 500);
  var response = res;
  if (response.errorCode == "200") {
     this.snackbar.showSuccess(response.message, response.status);
    setTimeout(() => {
      this.responseid=JSON.parse(response.response).Table[0].id;
      if(this.responseid==this.clsactivity.id)
      {
        this.clsactivity = new cls_addactivity(); // Reset form data
        window.location.href = "/profile";
      }
      this.clsactivity = new cls_addactivity(); // Reset form data

    }, 3000);
   
  } else {
    this.snackbar.showInfo(response._body.message, "Error");
  }
});
 
  }
}
 // Method to add a new profession to the list
 addNewProfession() {
   this.professions.push(new cls_addprofession());  // Push a new empty profession object
  // if (this.clsprofession.designation_id && this.clsprofession.from_year && this.clsprofession.to_year) {
  //   this.professions.push({ ...this.clsprofession });  // Push a copy of the current profession to the list
  //   this.clsprofession = new cls_addprofession(); // Reset the form for a new entry
  // } else {
  //   alert("Please fill in all the required fields.");
  // }
}
validateProfessions() {
  let validate = false;

  for (const profession of this.professions) {
    if (!profession.designation_id) {
      this.snackbar.showInfo("Please select Designation", "Error");
      validate = true;
      break;
    } 
    if (!profession.from_year || profession.from_year < 2015 || profession.from_year > 2100) {
      this.snackbar.showInfo("Please enter a valid From Year (2015-2100)", "Error");
      validate = true;
      break;
    }
    if (!profession.to_year || profession.to_year < 2015 || profession.to_year > 2100) {
      this.snackbar.showInfo("Please enter a valid To Year (2015-2100)", "Error");
      validate = true;
      break;
    }
    if (!profession.area || profession.area.trim() === '') {
      this.snackbar.showInfo("Please enter Charge Area", "Error");
      validate = true;
      break;
    }
    if (!profession.state_id) {
      this.snackbar.showInfo("Please select State", "Error");
      validate = true;
      break;
    }
    if (!profession.city_id) {
      this.snackbar.showInfo("Please select City", "Error");
      validate = true;
      break;
    }
    if (!profession.election_result || profession.election_result.trim() === '') {
      this.snackbar.showInfo("Please enter Election Result", "Error");
      validate = true;
      break;
    }
    if (!profession.election_contest || profession.election_contest.trim() === '') {
      this.snackbar.showInfo("Please enter Election Contest", "Error");
      validate = true;
      break;
    }
  }

  return validate;
}



saveproffession() { 
  var validate:boolean=false; 
  if (this.validateProfessions()) {
    return;
  }
if(!validate) {
 $(".page-loader-wrapper").show(); 

 const formattedData = {
  user_id: this.userdetails.user_id, 
  professions: this.professions.map(profession => ({
    id: profession.id || 0,  
    designation_id: profession.designation_id,
    from_year: profession.from_year,
    to_year: profession.to_year,
    area: profession.area,
    state_id: profession.state_id,
    city_id: profession.city_id,
    election_contest: profession.election_contest,
    election_result: profession.election_result
  }))
};
 
 this.service.SaveProfession(formattedData).subscribe((res: any) => {
   setTimeout(() => {
     $(".page-loader-wrapper").hide();
    
   }, 1000); 
   var response = res;
   if (response["errorCode"] == "200") {  
    this.snackbar.showSuccess(response.message, response.status);
   }
   else {
     // console.error("API returned an error:", response.message); 
     this.snackbar.showInfo(response["message"],"Error");
   }
     setTimeout(() => {
      window.location.reload();
        }, 3000);

 });
 
}
 
}

onFileChange(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.thumbnail_img = file; // Assign File object
      const reader = new FileReader();
      reader.onload = e => this.userdetails.details_imagePath = reader.result;

      reader.readAsDataURL(file);
    }
}
onFileChange_2(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.details_img = file; // Assign File object
      const reader = new FileReader();
      reader.onload = e => this.userdetails.details_imagePath1 = reader.result;

      reader.readAsDataURL(file);
  
    }
}
onFileChange_3(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.details_img = file; // Assign File object
      this.userdetails.image_path=file;
      const reader = new FileReader();
      reader.onload = e => this.userdetails.image_path = reader.result;

      reader.readAsDataURL(file);
    }
}
EditActivity(Activity: any){ 
    this.clsactivity = { ...Activity }; 
     // Convert date_of_posting to 'YYYY-MM-DD' format
     this.clsactivity.date_posting = Activity.date_of_posting.split('T')[0];
     this.clsactivity.friendlyurl = Activity.friendly_url;
     this.clsactivity.thumbnail_img=Activity.thumbnail_image;
    this.getCities(Activity.state_id) ;
    this.selectedCity = Activity.city_id; 
    this.getvillages(Activity.city_id,Activity.state_id); 
    this.selectedVillage = Activity.village_id;  
}

ActivityDetail(Activity: any) {  
  if (Activity && Activity.code) {
    this.router.navigate([`activity_detail`, Activity.code]);
  } else {
    console.error('Invalid Activity object or missing ID');
  }
}
EditProfession(profession: any) {  
  const objRequest = {
    typeId: 6,
    userid: 0,
    filterId:profession.id ,
    filterText: "",
    filterText1: ""
  };
 
  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response);  
      if (response["errorCode"] === "200") {
        this.professions=parseresponse.Table
       
        // this.ActivitiesDetail = parseresponse.Table;
        // this.clsactivity = { ...this.ActivitiesDetail[0] };
     
    //  this.clsactivity.date_posting = this.ActivitiesDetail[0].date_of_posting.split('T')[0];
    //  this.clsactivity.friendlyurl = this.ActivitiesDetail[0].friendly_url;
    //  this.clsactivity.thumbnail_img=this.ActivitiesDetail[0].thumbnail_image;
    //  this.clsactivity.id=this.ActivitiesDetail[0].id;
    this.getCities(this.professions[0].state_id) ;
    this.selectedCity = this.professions[0].city_id; 
   
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
DeleteProfession(profession: any) { 
  console.log('DeleteProfession:', profession);
  const objRequest = {
    typeId: 37,
    userid: 0,
    filterId: profession.id,
    filterText:"",
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
       
      if (response["errorCode"] === "200") {
        this.snackbar.showSuccess("", response.status);
            setTimeout(() => {
              window.location.reload();
            }, 500);
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
setSelectedActivity(activity: any): void {
  this.selectedActivity = activity;
}
setSelectedprofession(profession: any): void {
  this.selectedProfession = profession;
}
DeleteActivity(Activity: any) { 
  const objRequest = {
    typeId: 22,
    userid: 0,
    filterId: 0,
    filterText: Activity.code,
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response);  
      if (response["errorCode"] === "200") {
        this.snackbar.showSuccess("", response.status);
            setTimeout(() => {
              window.location.href = "/profile";
            }, 2000);
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



CancelActivity()
{
  this.clsactivity = new cls_addactivity(); // Reset form data
}
Back()
{
  window.location.href = "/profile";
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
export class cls_addactivity {
  constructor(){

  }
  title: string='';
  date_posting: string= '';
  activity_type:number=0;
  no_of_participants:number = 0;
  state_id:number = 0;
  city_id:number = 0;
  village_id:number = 0;
  short_desc: string = '';
  description: string = '';
  thumbnail_img: string | File = ''; // Allow both string and File
  details_img: string | File = ''; // Allow both string and File
  id:number=0;
  imagePath:string='';
  details_imagePath:string='';
  user_id:string='';
  friendlyurl:string='';
}
export class cls_addprofession {
  id: number = 0;
  designation_id: number = 0;  
  from_year: number = 0;
  to_year: number = 0;
  area: string = '';  
  state_id: number = 0;
  city_id: number = 0;
  election_result: string = '';
  election_contest: string = '';
}