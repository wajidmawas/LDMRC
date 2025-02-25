import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from '../profile/profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormControl ,FormsModule } from '@angular/forms';
@Component({
  selector: 'app-masters',
  standalone: true, 
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './masters.component.html',
  styleUrl: './masters.component.scss'
})
export class MastersComponent implements OnInit  { 
  IsTab:number=0;
  modalTitle:string='';tab_name:string='AICC';
  filename: any | null = null; 
  userDtail:any={};
  userdetails:any={}; 
  titlesearch:string='';todayDate:string="";
  Users: any = [];
  dataTables: any = [];
  states:any=[];cities:any=[];designations:any=[];
  Alldesignations:any=[];
  DesiginationList: any = [];
  selectedUser:number=0;
  searchValue: any = '';
  UsersList: any = [];
  clsCO:clsCO=new clsCO();
  professions: cls_addprofession[] = [new cls_addprofession()];
  pageNo :number=0;
  pageNo_2 :number=1;
  pageCount:any=100; 
  keyword: string='';
  totalRecords: number=0;
  noOfPages: number=0;
  UsersProfessions: any = [];
  constructor(private route: ActivatedRoute,private router: Router,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
    
}
ngOnInit(): void { 
  const today = new Date();
  this.todayDate = today.toISOString().split('T')[0];

  $(".page-loader-wrapper").fadeOut();  
  this.userDtail = localStorage.getItem("cl_user");
  this.userdetails = JSON.parse(this.userDtail)   
  this.getLookupMaster(0);
}
showTab(flg:number){
  this.IsTab=flg;  
  if(flg==1){
  this.LoadUsers("","-100");
  setTimeout(() => {
    this.LoadUsers("","");
  }, 1000);
}
else if (flg==2){
  this.getDesigination(0);
  this.LoadLeadersByPaging("")
}
}
addNewProfession() {
  this.professions.push(new cls_addprofession());  // Push a new empty profession object 
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
FilterProfessions(uid:number){
  return this.UsersProfessions.filter((item: any) =>item.uid=== uid);
}
nextprevious(flg:number){
  if(flg==1){
    this.pageNo=this.pageNo+1; 
    this.LoadLeadersByPaging("");
  }
  else{
    if(this.pageNo<=0){ 
      this.pageNo=0;
      this.snackbar.showInfo("No record[s] found", "Error");
    }
    else{
    this.pageNo=this.pageNo-1;
  }
  }
  this.pageNo_2=this.pageNo+1;
  this.LoadLeadersByPaging("");
}
onSearchChange(): void {  
  this.Users=[];
  this.UsersList=[];   this.UsersProfessions=[]; 
  this.pageNo=0;
  this.pageNo_2=1;
  this.pageCount=100;
  this.LoadLeadersByPaging(""); 
}
onpageChange(){
  this.pageNo=this.pageNo_2-1;
  this.LoadLeadersByPaging("");
}
onpagecountChange(){

  this.pageNo=0;
  this.pageNo_2=1; 
  this.LoadLeadersByPaging("");
}
returndisplay(){
  return ((parseFloat(this.pageCount) * this.pageNo) + parseFloat(this.pageCount))
}
LoadLeadersByPaging(filterText:any) {
  const objRequest = {
    pageNo: this.pageNo,
    keyword: this.searchValue,
    seqno: 0,
    pageCount:this.pageCount,
    FeatureId:100,
    Userid:0,
    TypeId:0,
    FilterText: filterText
  }; 
  this.service.getLeadersByPaging(objRequest).subscribe({
    next: (response: any) => { 
      this.Users=[];
      this.UsersList=[];
      this.UsersProfessions=[]; 
      if (response["errorCode"] === "200") {
        var parseresponse = JSON.parse(response.response); 
        this.Users = parseresponse.Table; 
        this.UsersList = parseresponse.Table;  
        this.UsersProfessions = parseresponse.Table2;  
        this.totalRecords=parseresponse.Table1[0]["TOTALRECORDS"];
        this.noOfPages=parseresponse.Table1[0]["NOOFPAGES"];
        if(this.totalRecords<this.pageCount)
         this.pageCount=this.totalRecords;
      } else {
        this.snackbar.showInfo(response.message, "Error");
      }
    },
    error: (error: any) => {
      this.snackbar.showInfo(error, "Error");
      // Handle the error appropriately
      // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
    },
    complete: () => {
     
    }
  });
}
viewDetails(access_token:any){
  window.location.href = "/user-profile/"+access_token;
}
addnew(tname:string){
this.tab_name=tname;
this.professions=[];
this.professions.push(new cls_addprofession()); 
this.modalTitle= this.IsTab==1 ?"Congress Organisation - "+ this.tab_name :this.IsTab==2 ?"Congress Leaders" :"New";
if(tname=='AICC')
this.designations=this.Alldesignations.filter((item: any) => (item.IsNational  === true));
else if(tname=='PCC')
this.designations=this.Alldesignations.filter((item: any) => (item.IsState  === true));
else if(tname=='DCC')
this.designations=this.Alldesignations.filter((item: any) => (item.IsDistrict  === true));
else 
this.designations=this.Alldesignations.filter((item: any) => (item.IsDept  === true));
}
addprofession(uid:number){
this.selectedUser=uid;
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
  user_id: this.selectedUser, 
  professions: this.professions.map(profession => ({
    id: profession.id || 0,  
    designation_id: profession.designation_id,
    from_year: profession.from_year,
    to_year: profession.to_year,
    area: profession.area,
    state_id: profession.state_id,
    city_id: profession.city_id,
    election_contest: profession.election_contest,
    exp_year:profession.exp_year,
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
onstateChange(event: any): void { 
  this.getCities(event.target.value) 
}
getCities(id: any) { 
  const objRequest = {
    typeId: 2,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  }; 
  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
     
      if (response["errorCode"] === "200") { 
        var parseresponse = JSON.parse(response.response);  
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
        this.Alldesignations=parseresponse.Table2;
        this.designations=parseresponse.Table2.filter((item: any) => (item.IsNational  === true));
      } else {
         
      }
    },
    error: (error: any) => {
       
      // Handle the error appropriately
      // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
    },
    complete: () => {
       
    }
  });
}
returnDataset(tab_type: any) {
  this.Users = this.UsersList;
  let filterData=this.dataTables.filter((item: any) => (item.Name.toLowerCase() === tab_type.toLowerCase()));
  if(filterData && filterData.length>0)
  return filterData[0].Data;
else
 return [];
}
_v123(){
  this.dataTables.push({"Name":"AICC", "Data":this.Users.filter((item: any) => (item.hid === 1))});
  this.dataTables.push({"Name":"PCC", "Data":this.Users.filter((item: any) => (item.hid === 2))});
  this.dataTables.push({"Name":"DCC", "Data":this.Users.filter((item: any) => (item.hid === 3))});
  this.dataTables.push({"Name":"SC", "Data":this.Users.filter((item: any) => ((item.did === 7 || item.did === 8 || item.did === 9 || item.did === 10) &&   (item.hid === 1 ||item.hid === 2)))});
    
} 
saveScreen(){
  var validate:boolean=false; 
  if(this.clsCO.name == undefined || this.clsCO.name == null || this.clsCO.name == '') {
   this.snackbar.showInfo("Please enter name","Error");
   validate=true;
 }
 else if(this.clsCO.mobile_no == undefined || this.clsCO.mobile_no == null || this.clsCO.mobile_no == '') {
   this.snackbar.showInfo("Please enter mobile no","Error");
   validate=true;
 }
 else if(this.clsCO.email_id == undefined || this.clsCO.email_id == null || this.clsCO.email_id == '') {
   this.snackbar.showInfo("Please enter email id ","Error");
   validate=true;
 }  
 else if(this.clsCO.state_id == undefined || this.clsCO.state_id == null || this.clsCO.state_id == 0) {
   this.snackbar.showInfo("Please select state","Error");
   validate=true;
 } 
 else if(this.clsCO.city_id == undefined || this.clsCO.city_id == null || this.clsCO.city_id ==0) {
   this.snackbar.showInfo("Please select city","Error");
   validate=true;
 }  
 else if(this.clsCO.designation == undefined || this.clsCO.designation == null || this.clsCO.designation ==0) {
  this.snackbar.showInfo("Please select designation","Error");
  validate=true;
}  
if(!validate) {
 $(".page-loader-wrapper").show(); 
this.clsCO.created_by=this.userdetails.user_id; 
const formData = new FormData();
// Append form fields 
formData.append('name', this.clsCO.name.toString());
formData.append('created_by', this.userdetails.user_id.toString());
formData.append('mobile_no', this.clsCO.mobile_no.toString());
formData.append('email_id', this.clsCO.email_id.toString());
formData.append('state_id', this.clsCO.state_id.toString());
formData.append('city_id', this.clsCO.city_id.toString());
formData.append('designation', this.clsCO.designation.toString());
formData.append('year', this.clsCO.year.toString());
formData.append('native_city', this.clsCO.native_city.toString());
formData.append('imageFile', this.clsCO.imageFile); 
formData.append('dob', this.clsCO.dob.toString());
formData.append('gender', this.clsCO.gender.toString()); 
formData.append('tab_type', this.tab_name); 
 this.service.SaveCO(formData).subscribe((res: any) => {
   setTimeout(() => {
     $(".page-loader-wrapper").hide();
   }, 500); 
   var response = res;
   if (response["errorCode"] == "200") {  
     this.snackbar.showSuccess("Successfully created","Success");  
   setTimeout(() => {
    window.location.reload();
   }, 5000);
   }
   else {
     // console.error("API returned an error:", response.message); 
     this.snackbar.showInfo(response["message"],"Error");
   }
 });
 
}
 
}
onFileChange(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsCO.imageFile = file; 
      const reader = new FileReader();
      reader.onload = e  => this.userdetails.details_imagePath = reader.result; 
      reader.readAsDataURL(file); 
    }
}
LoadUsers(filtertext: string,getTopRecords:string) {
  const objRequest = {
    typeId: 8,
    userid: 0,
    filterId: 0,
    filterText: filtertext,
    filterText1: getTopRecords
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      this.Users = [];
        this.UsersList = [];
        this.dataTables=[];
      $.each($(".nexagrid-basic-example"), function (ind, val) {
        $(val).DataTable().destroy();
      }) 
      if (response["errorCode"] === "200") {
        var parseresponse = JSON.parse(response.response);   
          this.Users = parseresponse.Table;
          this.UsersList = parseresponse.Table;
          this._v123 (); 
        setTimeout(() => {
          $.each($(".nexagrid-basic-example"), function (ind, val) {
            $(val).DataTable({
              pageLength: 50,
              searching: true,
              'info': true
            });
          })
        }, 100);
      } else { 
       
        this.Users = [];
        this.UsersList = [];
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
Back()
{
  window.location.href = "/knowledge_base";
}
 
}
export class clsCO {
  constructor(){

  }
  name: string='';  
  state_id:number = 0;
  city_id:number = 0;created_by:number = 0;
  village_id:number = 0;
  mobile_no: string = '';
  gender: string = '';
  dob: string = '';
  email_id: string = ''; native_city: string = '';
  designation:number = 0;
  area:string='';
  year:number = 0;
  imagePath:string='';
  user_id:string=''; 
  imageFile: string | File = ''; // Allow both string and File
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
  exp_year: number = 0;
}