import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from './profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


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

  Activities:any=[];
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
  states: any = []; cities: any = [];ActivityType: any = [];DesiginationList: any = [];
  userDtail:any={};ProfessionList: any = [];
  ElectionData: any = [];
  userdetails:any={};
  villages:any=[];
  titlesearch:string='';
//#add activity 
activityId: string | null = null;
responseid:any=[];
//#end activity



constructor( private router: Router,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
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
console.log("UserDetails",this.userdetails)
this.getLookupMaster(0);
this.getActivityType(0);
this.getDesigination(0); 
 this.LoadActivity(this.userdetails.user_id,this.titlesearch);
}

ngAfterViewInit(): void {
  
}
addactivity(){
    this.router.navigate([`/profile/addactivity`, 0]);
}
searchactivity(){ 
  this.LoadActivity(this.userdetails.user_id,this.titlesearch);

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
      var parseresponse = JSON.parse(response.response); 
     debugger;
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
console.log(formattedData);
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
    }
}
onFileChange_2(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.details_img = file; // Assign File object
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
  console.log('profession:', profession);
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
      debugger;
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
      var parseresponse = JSON.parse(response.response);  
      debugger;
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