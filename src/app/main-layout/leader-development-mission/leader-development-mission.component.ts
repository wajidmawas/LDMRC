 
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
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
import 'jquery';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-leader-mission',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './leader-development-mission.component.html',
  styleUrl: './leader-development-mission.component.scss'
})
export class LeaderDevelopmentMissionComponent {
  clsldm:cls_addldm=new cls_addldm();
  isLoggedIn:any='';
  Userid:any='';
  selectedLDM: any = null;
  userdetails:any={};
  DesignationLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  Users: any = [];
  searchValue:any=[];
  UsersList: any = [];
  LDMActivities: any = [];
  States: any = [];
  Districts: any = [];DistrictsList: any = [];
  DistrictsLimit:number=5;
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedDesignation:number | null = null;

  selectedVillage:number | null = null;
  filename: any | null = null;
  ActivitiesDetail:any=[];
  Activities:any=[];
  states: any = []; Assembly: any = [];ActivityType: any = [];DesiginationList: any = [];
  userDtail:any={};ProfessionList: any = [];
  isOpen = false;
  villages:any=[];
  titlesearch:string='';
  activityId: string | null = null;
responseid:any=[];
FilterSection: any = [];AllDesignations: any = [];
  FilterOptions: any = {"Designation":false,"State":false,"District":false,"Age":false,"Gender":false,"YearofExp":false};
  constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
      this.userDetail = this.sharedService.getUserSession();
      // this.userdetails=JSON.parse(this.userDetail.user_id);
      this.userDtail = localStorage.getItem("cl_user");
      this.userdetails = JSON.parse(this.userDtail) 
    
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
      this.getLookupMaster(0);
      this.getDesigination(0);
      this.getActivityType(0);
     }
     else{
      window.location.href = "/auth/login";
     } 
  }
  onSearchChange(tableid:string): void {  
    $("#"+tableid+"_wrapper").find("tbody tr").show()
    if(this.searchValue!=null && this.searchValue!=undefined && this.searchValue!=""){
      let searchkeyword=this.searchValue;
      $("#"+tableid+"_wrapper").find("tbody tr").each(function (ind, val) { 
            if ($(this).find("td")[2].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1 && 
                $(this).find("td")[4].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1) {
                $(this).hide();
            }
            else {
                $(this).show();
            } 
    });
   
    }
     
  }
  showTab(tab_type:any){  
    this.Users=this.UsersList;
    this.Users=this.Users.filter((item: any) =>(item.stream === tab_type)); 
    this.Designations=this.AllDesignations;
    let isExists=this.FilterSection.filter((item: any) =>(item.page.toLowerCase() =='leader_dev_mission' && 
     item.tab_name.toLowerCase()==tab_type.toLowerCase() && item.is_active==true && 
     item.filter_name.toLowerCase()=="designation"))
     if(isExists.length>0){
      var filteredData = this.Designations.filter(function(item:any) {
        return (
          isExists[0].filter_section_name.indexOf(parseInt(item.id)) > -1
        );
      });
      if(filteredData.length>0){
        this.Designations=filteredData
      }
     }

  }
  returnDataset(tab_type:any){  
    if(this.UsersList.length>0){
    this.Users=this.UsersList; 
    return this.Users = this.Users.filter((item: any) =>(item.stream === tab_type));
     
    }
  }
  viewDetails(access_token:any){
    window.location.href = "/user-profile/"+access_token;
  }
  export2Excel(fileNm:string){
     
    const downloadLink = document.createElement('a');
    let table: any = [];
    table = document.getElementById(fileNm);
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    var html = table.outerHTML;
    var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
    downloadLink.href = 'data:' + url + ' ';
    downloadLink.download = 'leader_development_mission.xls'
    downloadLink.click();
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
          this.Districts = parseresponse.Table4;  
          this.AllDesignations=this.Designations; 

            let cofilter=parseresponse.Table5.filter((item: any) => item.page_name=='leader_dev_mission');
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
  LoadUsers() {
    const objRequest = {
      typeId: 8,
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
          this.Users = parseresponse.Table2; 
          this.UsersList = parseresponse.Table2; 
          this.Users=this.Users.filter((item: any) =>(item.stream === "SC Dept"));
          this.LDMActivities = parseresponse.Table3; 

          setTimeout(() => {
            $.each($(".nexagrid-basic-example"),function(ind,val){  
              $(val).DataTable({
                  pageLength: 10, 
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
else if(type=='districts'){
  this.DistrictsLimit=this.Districts.length;
}
  }
  showless(type:any){
    if(type=='states'){
      this.StatesLimit=5;
    }
    else if(type=='designation'){
      this.DesignationLimit=5;
    }
    else if(type=='districts'){
      this.DistrictsLimit=5;
    }
      }
      LoadDistrictsByState(stateId:string) {
        const objRequest = {
          typeId: 43,
          userid: 0,
          filterId: 0,
          filterText: stateId,
          filterText1: ""
        };
      
        this.service.getMasters(objRequest).subscribe({
          next: (response: any) => {  
            if (response["errorCode"] === "200") {
              var parseresponse = JSON.parse(response.response);  
              this.Districts = parseresponse.Table; 
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
  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
  onActvitytypeChange(event: any): void {
    this.selectedActvity = event.target.value; 
  }
  onDesiginationChange(event: any): void {
    this.selectedDesignation = event.target.value; 
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
      this.Districts=this.DistrictsList;
      let selectedlist = this.States
      .filter((item: any) => item.is_selected==true)
      .map((item: any) => item.STATEID);
      if(selectedlist.length>0){
        let templist='';
        selectedlist.forEach((element:any) => {
          templist=templist+ element +",";
        });
        this.LoadDistrictsByState(templist)
      }
    }
  }
  else  if(checked_type=='Districts'){
    let obj=this.Districts.filter((item: any) =>(item.DISTRICTID === childitem.DISTRICTID));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
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
  onstateChange(event: any): void {
    this.selectedState = event.target.value; 
    this.getAssembly(event.target.value) 
  }
  oncityChange(event: any): void {
    this.selectedCity = event.target.value; 
    this.getvillages(event.target.value,this.selectedState);
  }
  onvillageChange(event: any): void {
    this.selectedVillage = event.target.value; 
  }
  getAssembly(id: any) { 
    const objRequest = {
      typeId: 40,
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
          this.Assembly = parseresponse.Table1
         console.log("Assembly" + JSON.stringify(this.Assembly))
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
      typeId: 36,
      userid: 0,
      filterId: state,
      filterText: "",
      filterText1: ""
    };
    console.log(JSON.stringify(objRequest));
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {    
        if (response["errorCode"] === "200") {  
          var parseresponse = JSON.parse(response.response); 
          this.villages = parseresponse.Table 
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
  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        const file = input.files[0];
        this.clsldm.imageFile = file; // Assign File object 
        this.clsldm.imagePath=file.name;
      }
  }
  onpdfChange(event: any) {
    const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        const file = input.files[0];
        this.clsldm.pdfFile = file; // Assign File object
        this.clsldm.pdfPath=file.name;

      }
  }
  ViewActivityDetails(Activity:any)
  {
    console.log('Activity:', Activity);
    if (Activity && Activity.code) {
      this.router.navigate([`activity_detail`, Activity.code]);
    } else {
      console.error('Invalid Activity object or missing ID');
    }
  }
  CancelActivity()
  {
    this.clsldm = new cls_addldm(); // Reset form data
  }
  SaveLDM() { 
    var validate:boolean=false;
  
    // Perform client-side validation
    if (this.clsldm.title == undefined || this.clsldm.title == null || this.clsldm.title == '') {
      this.snackbar.showInfo("Please enter title", "Error");
      validate = true;
    } else if (this.clsldm.desc == undefined || this.clsldm.desc == null || this.clsldm.desc == '') {
      this.snackbar.showInfo("Please enter short description", "Error");
      validate = true;
    } else if (this.clsldm.expected_outcome == undefined || this.clsldm.expected_outcome == null || this.clsldm.expected_outcome == '') {
      this.snackbar.showInfo("Please enter description", "Error");
      validate = true;
    } else if (this.clsldm.imageFile == undefined || this.clsldm.imageFile == null || this.clsldm.imageFile == '') {
      this.snackbar.showInfo("Please select an image", "Error");
      validate = true;
    }
    else if (this.clsldm.pdfFile == undefined || this.clsldm.pdfFile == null || this.clsldm.pdfFile == '') {
      this.snackbar.showInfo("Please select an image", "Error");
      validate = true;
    }
    else if (this.clsldm.state_id == undefined || this.clsldm.state_id == null || this.clsldm.state_id == 0) {
      this.snackbar.showInfo("Please select an image", "Error");
      validate = true;
    }
    else if (this.clsldm.assembly_id == undefined || this.clsldm.assembly_id == null || this.clsldm.assembly_id == 0) {
      this.snackbar.showInfo("Please select Assembly", "Error");
      validate = true;
    }
    else if (this.clsldm.village_id == undefined || this.clsldm.village_id == null || this.clsldm.village_id == 0) {
      this.snackbar.showInfo("Please select Village", "Error");
      validate = true;
    }
    else if (this.clsldm.designation_id == undefined || this.clsldm.designation_id == null || this.clsldm.designation_id == 0) {
      this.snackbar.showInfo("Please select Desigination", "Error");
      validate = true;
    }
    else if (this.clsldm.no_of_participants == undefined || this.clsldm.no_of_participants == null || this.clsldm.no_of_participants == 0) {
      this.snackbar.showInfo("Please enter participants", "Error");
      validate = true;
    }
    else if (this.clsldm.date_of_posting == undefined || this.clsldm.date_of_posting == null || this.clsldm.date_of_posting == '') {
      this.snackbar.showInfo("Please enter Date", "Error");
      validate = true;
    } 
    if (!validate) {
      $(".page-loader-wrapper-review").show();
      const formData = new FormData();
      // Append form fields
      formData.append('date_of_posting', this.clsldm.date_of_posting);
      formData.append('office_bearer', this.clsldm.office_bearer);
      formData.append('desc', this.clsldm.desc);
      formData.append('title', this.clsldm.title);
     // Append file only if it exists
     if (this.clsldm.imageFile && this.clsldm.imageFile instanceof File) {
      formData.append('imageFile', this.clsldm.imageFile);
    }
      // Append file only if it exists
      if (this.clsldm.pdfFile && this.clsldm.pdfFile instanceof File) {
        formData.append('pdfFile', this.clsldm.pdfFile);
      }
      formData.append('imagePath', this.clsldm.imagePath.toString());
      formData.append('pdfPath', this.clsldm.pdfPath.toString());
      formData.append('expected_outcome', this.clsldm.expected_outcome.toString());
      formData.append('state_id', this.clsldm.state_id.toString());
      formData.append('activity_id', this.clsldm.activity_id.toString());
      formData.append('assembly_id', this.clsldm.assembly_id.toString());
      formData.append('village_id', this.clsldm.village_id.toString());
      formData.append('designation_id', this.clsldm.designation_id.toString());
      formData.append('no_of_participants', this.clsldm.no_of_participants.toString());
      formData.append('created_by', this.userdetails.user_id.toString());
      formData.append('id',this.clsldm.id.toString());
  this.service.Saveldm(formData).subscribe((res: any) => {
    setTimeout(() => {
      $(".page-loader-wrapper-review").hide();
    }, 500);
    var response = res;
    if (response.errorCode == "200") {
       this.snackbar.showSuccess(response.message, response.status);
      setTimeout(() => {
        this.responseid=JSON.parse(response.response).Table[0].Column1; 
        if(this.responseid==this.clsldm.id)
        {
          this.clsldm = new cls_addldm(); // Reset form data
          window.location.href = "/leader_development_mission";
        }
        this.clsldm = new cls_addldm(); // Reset form data
  
      }, 3000);
     
    } else {
      this.snackbar.showInfo(response._body.message, "Error");
    }
  });
   
    }
  }
  getActivityType(id: any) {
    const objRequest = {
      typeId: 40,
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
  EditLDM(LDM: any) { 
    console.log('LDM:', LDM);
    const objRequest = {
      typeId: 38,
      userid: 0,
      filterId:LDM.id ,
      filterText: "",
      filterText1: ""
    };
   
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response);  
        if (response["errorCode"] === "200") {
          this.clsldm=parseresponse.Table
          this.clsldm = { ...parseresponse.Table[0] };
     this.clsldm.imageFile = parseresponse.Table[0].imagePath;
     this.clsldm.pdfFile = parseresponse.Table[0].pdfPath;
     this.clsldm.date_of_posting = parseresponse.Table[0].date_of_posting.split('T')[0];
     this.getAssembly(parseresponse.Table[0].state_id)
    // this.getCities(this.ActivitiesDetail[0].state_id) ;
    this.selectedCity = parseresponse.Table[0].assembly_id; 
    this.getvillages("",parseresponse.Table[0].state_id); 
    this.selectedVillage = parseresponse.Table[0].village_id; 

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
  DeleteLDM(LDM: any) { 
    console.log('LDM:', LDM);
    const objRequest = {
      typeId: 39,
      userid: 0,
      filterId: LDM.id,
      filterText:"",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response);   
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
  setSelectedLDM(LDM: any): void {
    this.selectedLDM = LDM;
  }
}

export class cls_addldm {
  constructor(){

  }
  date_of_posting: string= '';
  office_bearer: string= '';
  desc: string = '';
  title: string='';
  imageFile: string | File = ''; // Allow both string and File
  pdfFile: string | File = ''; // Allow both string and File
  imagePath:string='';
  pdfPath:string='';
  expected_outcome: string='';
  state_id:number = 0;
  activity_id:number=0;
  assembly_id:number = 0;
  village_id:number = 0;
  designation_id:number = 0;
  no_of_participants:number = 0;
  id:number=0;
  created_by:number=0;
}