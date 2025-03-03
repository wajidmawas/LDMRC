 
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
import 'datatables.net';
import 'datatables.net-bs4';
@Component({
  selector: 'app-elections-leaders',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './election-members.component.html',
  styleUrl: './election-members.component.scss'
})
export class ElectionMembersComponent {
  isLoggedIn:any='';
  userdetails:any={};
  DesignationLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  Users: any = [];
  UsersList: any = [];
  LDMActivities: any = [];
  SittingDataMLA: any = [];AllSittingDataMLA: any = [];
  SittingDataMP: any = [];AllSittingDataMP: any = [];
  States: any = [];
  isOpen = false;
  searchValue : any="";
  Districts: any = [];
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
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
     if(this.isLoggedIn!=null){
      this.LoadMasters();
      this.LoadUsers() ;
     }
     else{
      window.location.href = "/auth/login";
     } 
    

  }
  showTab(tab_type:any){  
    if(tab_type==1){
      this.LDMActivities=this.UsersList; 
    }
    else if(tab_type==2){
      this.SittingDataMLA=this.AllSittingDataMLA; 
    }
    else if(tab_type==3){
      this.SittingDataMP=this.AllSittingDataMP; 
    }
  }
  returnDataset(tab_type:any){  
    if(tab_type==1){
     return this.LDMActivities=this.UsersList; 
    }
    else if(tab_type==2){
      return this.SittingDataMLA=this.AllSittingDataMLA; 
    }
    else if(tab_type==3){
      return this.SittingDataMP=this.AllSittingDataMP; 
    }
  }
  
  onSearchChange(tableid:string): void {  
    $("#"+tableid+"_wrapper").find("tbody tr").show()
    if(this.searchValue!=null && this.searchValue!=undefined && this.searchValue!=""){
      let searchkeyword=this.searchValue;
      $("#"+tableid+"_wrapper").find("tbody tr").each(function (ind, val) { 
            if ($(this).find("td")[6].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1 && 
                $(this).find("td")[9].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1) {
                $(this).hide();
            }
            else {
                $(this).show();
            } 
    });
   
    }
     
  }

  onCheckedResult(childitem:any,checked_type:any) {  
  if(checked_type=='States'){
    let obj=this.States.filter((item: any) =>(item.STATEID === childitem.STATEID));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
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
  bindFilter(list:any,primarycol:any,filterType:any){
    let selectedlist = list
    .filter((item: any) => item.is_selected==true)
    .map((item: any) => item[primarycol]);
  
    let list1:any=[];
    let list2:any=[];
    selectedlist.forEach((element:any) => {
      let filterList = this.SittingDataMLA
      .filter((item: any) => item.state_id==element) 
       list1.push(filterList);

        filterList = this.LDMActivities
       .filter((item: any) => item.state_id==element) 
       list2.push(filterList);
    });

    if(list1.length>0)
    this.SittingDataMLA=list1[0];
    if(list2.length>0)
    this.LDMActivities=list2[0];
    let el:any = document.getElementById('AICC');
        el.scrollIntoView();
  }
  ApplyFilter(){
    this.SittingDataMLA=this.AllSittingDataMLA;
    this.LDMActivities=this.UsersList;
    this.bindFilter(this.States,"STATEID","States")   
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
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.Designations = parseresponse.Table2;
          this.States = parseresponse.Table1; 
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
  export2Excel(fileNm:string){ 
    const downloadLink = document.createElement('a');
    let table: any = [];
    table = document.getElementById(fileNm);
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    var html = table.outerHTML;
    var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
    downloadLink.href = 'data:' + url + ' ';
    downloadLink.download = 'election_data.xls'
    downloadLink.click();
  }
  printTable(fileNm:string){ 
    let el:any = document.getElementById('divPrint');
    $(el).html($("#"+fileNm)[0]);
  }
  printgrid(){  
    let el:any = document.getElementById('divPrint'); 
    var mywindow:any = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<link rel="stylesheet" href="/styles.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write($(el).html());
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    setTimeout(function(){mywindow.print();},500);
   // mywindow.close();  
  }
  LoadUsers() {
    const objRequest = {
      typeId: 47,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
      
        $.each($(".nexagrid-basic-example"),function(ind,val){ 
          $(val).DataTable().destroy(); 
      })  
        if (response["errorCode"] === "200") { 
          var parseresponse = JSON.parse(response.response); 
          this.UsersList = parseresponse.Table;  
          this.LDMActivities = parseresponse.Table; 
          this.SittingDataMLA = parseresponse.Table1; 
          this.AllSittingDataMLA = parseresponse.Table1; 
          this.SittingDataMP = parseresponse.Table2; 
          this.AllSittingDataMP = parseresponse.Table2; 

          setTimeout(() => {
            $.each($(".nexagrid-basic-example"),function(ind,val){  
              $(val).DataTable({
                pageLength: 50, 
                  searching: true,
                }); 
          }) 
           }, 100);

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
  showmore(type:any){
if(type=='states'){
  this.StatesLimit=this.States.length;
}
else if(type=='designation'){
  this.DesignationLimit=this.Designations.length;
}
  }
  showless(type:any){
    if(type=='states'){
      this.StatesLimit=5;
    }
    else if(type=='designation'){
      this.DesignationLimit=5;
    }
      }
  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
}
