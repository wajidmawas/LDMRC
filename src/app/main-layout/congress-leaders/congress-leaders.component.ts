 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { dashboardService } from '../dashboard/dashboard.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';   
import { TranslateService } from '@ngx-translate/core';  
import dayGridPlugin from '@fullcalendar/daygrid' 
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormControl,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
@Component({
  selector: 'app-congress-leaders',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './congress-leaders.component.html',
  styleUrl: './congress-leaders.component.scss'
})
export class CongressLeadersComponent {
  isLoggedIn:any='';
  userdetails:any={};
  DesignationLimit:number=5;
  CasteLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  FiltersList: any = [];
  Designations: any = [];
  CasteList: any = [];
  Users: any = [];
  UsersList: any = [];
  UsersProfessions: any = [];
  States: any = [];
  usersid:number = 0;
  Districts: any = [];
  pageNo :number=0;
  pageNo_2 :number=1;
  pageCount:any=100;
  GenderList: any = [];
  AgeList: any = [];
  ElectionYear: any = [];
  ElectionType: any = [];
  ElectionResult: any = [];
  ElectionContested: any = [];
  searchValue: string='';
  keyword: string='';
  totalRecords: number=0;
  noOfPages: number=0;
  openSection: string | null = null;
  FilterSection: any = [];AllDesignations: any = [];
  FilterOptions: any = {"Designation":false,"ElectionResult":false,"ElectionContested":false,"State":false,"ElectionYear":false,"ElectionType":false,"District":false,"Caste":false,"Age":false,"Gender":false,"YearofExp":false};
  constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
      this.userDetail = this.sharedService.getUserSession();
      
      var year  = new Date().getFullYear();
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric',
        month: 'long', // Full month name
        day: 'numeric',
        weekday: 'long', // Full day name
      }; 
  }
  toggleOpen(section: string) {
    this.openSection = this.openSection === section ? null : section;
  }
  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
     if(this.isLoggedIn!=null){
      this.LoadMasters();
      this.LoadUsers("") ; 
      this.GenderList.push({"name":"Male","is_selected":false})
      this.GenderList.push({"name":"Female","is_selected":false}) 

      this.ElectionContested.push({"name":"Yes","is_selected":false})
      this.ElectionContested.push({"name":"No","is_selected":false})

      this.ElectionResult.push({"name":"Won","is_selected":false})
      this.ElectionResult.push({"name":"Lost","is_selected":false}) 

      this.AgeList.push({"name":"18 to 25","is_selected":false})
      this.AgeList.push({"name":"25 to 35","is_selected":false})
      this.AgeList.push({"name":"35 to 45","is_selected":false})
      this.AgeList.push({"name":"45 to 55","is_selected":false})
      this.AgeList.push({"name":"55 to 65","is_selected":false})
      this.AgeList.push({"name":"65 and above","is_selected":false}) 
 
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }
  nextprevious(flg:number){
    if(flg==1){
      this.pageNo=this.pageNo+1; 
      this.LoadUsers("");
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
    this.LoadUsers("");
  }
  bindFilter(list:any,primarycol:any,filterType:any){
    let selectedlist = list
    .filter((item: any) => item.is_selected==true)
    .map((item: any) => item[primarycol]);
  
    selectedlist.forEach((element:any) => {
      this.FiltersList.push({ filterType: filterType, id: element });
    });
  }
  export2Excel(){
     
    const downloadLink = document.createElement('a');
    let table: any = [];
    table = document.getElementById('exportable');
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    var html = table.outerHTML;
    var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
    downloadLink.href = 'data:' + url + ' ';
    downloadLink.download = 'congress_leaders.xls'
    downloadLink.click();
  }
  filterResult(){ 
    this.FiltersList=[];
    this.bindFilter(this.Designations,"id","Designations")
    this.bindFilter(this.States,"STATEID","States") 
    this.bindFilter(this.GenderList,"name","Gender")  
    this.bindFilter(this.CasteList,"id","Caste")  
    this.bindFilter(this.AgeList,"name","Age")  
    this.bindFilter(this.ElectionYear,"name","ElectionYear")  
    this.bindFilter(this.ElectionType,"name","ElectionType")  
    this.LoadUsers(JSON.stringify(this.FiltersList))
}
  onCheckedResult(childitem:any,checked_type:any) {  
    if(checked_type=='Designations'){
    let obj=this.Designations.filter((item: any) =>(item.id === childitem.id));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  else  if(checked_type=='States'){
    let obj=this.States.filter((item: any) =>(item.STATEID === childitem.STATEID));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  else  if(checked_type=='Gender'){
    let obj=this.GenderList.filter((item: any) =>(item.name === childitem.name));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  else  if(checked_type=='Caste'){
    let obj=this.CasteList.filter((item: any) =>(item.id === childitem.id));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  else  if(checked_type=='Age'){
    let obj=this.AgeList.filter((item: any) =>(item.name === childitem.name));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  else  if(checked_type=='ElectionYear'){
    let obj=this.ElectionYear.filter((item: any) =>(item.name === childitem.name));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  else  if(checked_type=='ElectionType'){
    let obj=this.ElectionType.filter((item: any) =>(item.name === childitem.name));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  }
  onSearchChange(): void {  
    this.Users=[];
    this.UsersList=[];
    this.UsersProfessions=[]; 
    this.pageNo=0;
    this.pageNo_2=1;
    this.pageCount=100;
    this.LoadUsers("");
     
  }
  showTab(tab_type:any){ 
    this.Users=this.UsersList;
    this.usersid = this.UsersList.id;
    if(tab_type=='PCC')
    return this.Users=this.Users.filter((item: any) =>(item.designation_id === 2 || item.designation_id === 3));
  else  if(tab_type=='SC')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 3));
  else  if(tab_type=='ST')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 4));
  else  if(tab_type=='OBC')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 5));
  else  if(tab_type=='Minority')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 6));
  }
  viewDetails(access_token:any){
    window.location.href = "/user-profile/"+access_token;
  }
  LoadMasters() {
    const objRequest = {
      typeId: 1,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
        if (response["errorCode"] === "200") {
          var parseresponse = JSON.parse(response.response); 
          this.Designations = parseresponse.Table2;
          this.AllDesignations=this.Designations;
          this.States = parseresponse.Table1; 
          this.CasteList = parseresponse.Table;
          this.ElectionYear=parseresponse.Table8.filter((item: any) => item.master_type=='Election Type');
          this.ElectionType=parseresponse.Table8.filter((item: any) => item.master_type=='Year Of Election');

            let cofilter=parseresponse.Table5.filter((item: any) => item.page_name=='congress_leaders');
            this.FilterSection=parseresponse.Table6;
  
            if(cofilter!=null && cofilter.length>0){
              var option=cofilter[0].filter_section_name.split(',')
              let temp=option.filter((item: any) => item.toLowerCase()=='designation');
              if(temp!=null && temp.length>0){
                this.FilterOptions.Designation=true;
              }
              temp=option.filter((item: any) => item.toLowerCase()=='state');
              if(temp!=null && temp.length>0){
                this.FilterOptions.State=true;
              }
              temp=option.filter((item: any) => item.toLowerCase()=='district');
              if(temp!=null && temp.length>0){
                this.FilterOptions.District=true;
              }
              temp=option.filter((item: any) => item.toLowerCase()=='age');
              if(temp!=null && temp.length>0){
                this.FilterOptions.Age=true;
              }
              temp=option.filter((item: any) => item.toLowerCase()=='gender');
              if(temp!=null && temp.length>0){
                this.FilterOptions.Gender=true;
              }
              temp=option.filter((item: any) => item.toLowerCase()=='electiontype');
              if(temp!=null && temp.length>0){
                this.FilterOptions.ElectionType=true;
              }
              temp=option.filter((item: any) => item.toLowerCase()=='electionyear');
              if(temp!=null && temp.length>0){
                this.FilterOptions.ElectionYear=true;
              } 
               temp=option.filter((item: any) => item.toLowerCase()=='electionresult');
              if(temp!=null && temp.length>0){
                this.FilterOptions.ElectionResult=true;
              } 
              temp=option.filter((item: any) => item.toLowerCase()=='electioncontested');
              if(temp!=null && temp.length>0){
                this.FilterOptions.ElectionContested=true;
              }
              temp=option.filter((item: any) => item.toLowerCase()=='caste');
              if(temp!=null && temp.length>0){
                this.FilterOptions.Caste=true;
              }
            }

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
  onAllCheckedResult(list:any,listType:any){
    list.forEach((element:any) => {
      element.is_selected=element.is_selected==true ? false :true;
    }); 
     
  }
  clearCheckedResult(list:any,listType:any){
    list.forEach((element:any) => {
      element.is_selected=false;
    }); 
     
  }
  onpageChange(){
    this.pageNo=this.pageNo_2-1;
    this.LoadUsers("");
  }
  onpagecountChange(){

    this.pageNo=0;
    this.pageNo_2=1; 
    this.LoadUsers("");
  }
  returndisplay(){
    return ((parseFloat(this.pageCount) * this.pageNo) + parseFloat(this.pageCount))
  }
  LoadUsers(filterText:any) {
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
  showmore(type:any){
if(type=='states'){
  this.StatesLimit=this.States.length;
}
else if(type=='designation'){
  this.DesignationLimit=this.Designations.length;
}
else if(type=='caste'){
  this.CasteLimit=this.CasteList.length;
}
}
FilterProfessions(uid:number){
  return this.UsersProfessions.filter((item: any) =>item.uid=== uid);
}
  showless(type:any){
    if(type=='states'){
      this.StatesLimit=5;
    }
    else if(type=='designation'){
      this.DesignationLimit=5;
    }
     else if(type=='caste'){
      this.CasteLimit=5;
    }
      }
  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
}
