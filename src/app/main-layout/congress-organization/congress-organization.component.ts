
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
import { FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-congress-organization',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule],
  templateUrl: './congress-organization.component.html',
  styleUrl: './congress-organization.component.scss'
})

export class CongressOrganizationComponent {
  isLoggedIn: any = '';
  userdetails: any = {};
  DesignationLimit: number = 5;
  DepartmentLimit: number = 5;
  StatesLimit: number = 5;
  DistrictsLimit: number = 5;
  userDetail: any = {};
  Designations: any = []; Committees: any = [];
  FrontalNames: any = [];
  current_tab:string='AICC';
  Departments: any = [];
  FiltersList: any = [];
  Users: any = [];
  dataTables: any = [];
  searchValue: any = '';
  UsersList: any = [];
  States: any = [];
  FilterSection: any = []; AllDesignations: any = [];
  isOpen = false;
  FilterOptions: any = { "Designation": false, "State": false, "District": false, "Committees": false, "frontals": false, "Departments": false };
  FilterTabs: any = [];
  Districts: any = []; DistrictsList: any = [];
  constructor(public sharedService: SharedService, private router: Router, private service: dashboardService, private snackbar: SnackbarService, private translate: TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
    this.userDetail = this.sharedService.getUserSession();

    var year = new Date().getFullYear();
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
    if (this.isLoggedIn != null) {
      this.LoadMasters();
      this.LoadUsers("");
    }
    else {
      window.location.href = "/auth/login";
    }

  }
  onSearchChange(tableid: string): void {
    $("#" + tableid + "_wrapper").find("tbody tr").show()
    if (this.searchValue != null && this.searchValue != undefined && this.searchValue != "") {
      let searchkeyword = this.searchValue;
      $("#" + tableid + "_wrapper").find("tbody tr").each(function (ind, val) {
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

  printTable(fileNm: string) {
    let el: any = document.getElementById('divPrint');
    $(el).html($("#" + fileNm)[0]);
  }
  printgrid() {
    let el: any = document.getElementById('divPrint');
    var mywindow: any = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<link rel="stylesheet" href="/styles.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write($(el).html());
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    setTimeout(function () { mywindow.print(); }, 500);
    // mywindow.close();  
  }
  export2Excel(fileNm: string) {

    const downloadLink = document.createElement('a');
    let table: any = [];
    table = document.getElementById(fileNm);
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    var html = table.outerHTML;
    var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
    downloadLink.href = 'data:' + url + ' ';
    downloadLink.download = 'congress_organisation.xls'
    downloadLink.click();
  }
  bindFilter(list: any, primarycol: any, filterType: any) {
    let selectedlist = list
      .filter((item: any) => item.is_selected == true)
      .map((item: any) => item[primarycol]);

    selectedlist.forEach((element: any) => {
      this.FiltersList.push({ filterType: filterType, id: element });
    });
  }
  filterResult() {
    this.FiltersList = [];
    this.bindFilter(this.Designations, "id", "Designations")
    this.bindFilter(this.FrontalNames, "DeptId", "FrontalNames")
    this.bindFilter(this.Committees, "DeptId", "Committees")
    this.bindFilter(this.Departments, "DeptId", "Departments") 
    this.bindFilter(this.States,"STATEID","States") 
    this.bindFilter(this.Districts,"DISTRICTID","Districts") 
    this.LoadUsers(JSON.stringify(this.FiltersList))
  }


  onCheckedResult(childitem: any, checked_type: any) {
    if (checked_type == 'Designations') {
      let obj = this.Designations.filter((item: any) => (item.id === childitem.id));
      if (obj != null) {
        obj[0].is_selected = obj[0].is_selected == true ? false : true;
      }
    }
    else if (checked_type == 'States') {
      let obj = this.States.filter((item: any) => (item.STATEID === childitem.STATEID));
      if (obj != null) {
        obj[0].is_selected = obj[0].is_selected == true ? false : true;
        this.Districts = this.DistrictsList;
        let selectedlist = this.States
          .filter((item: any) => item.is_selected == true)
          .map((item: any) => item.STATEID);
        if (selectedlist.length > 0) {
          let templist = '';
          selectedlist.forEach((element: any) => {
            templist = templist + element + ",";
          });
          this.LoadDistrictsByState(templist)
        }
      }
    }
    else if (checked_type == 'Districts') {
      let obj = this.Districts.filter((item: any) => (item.DISTRICTID === childitem.DISTRICTID));
      if (obj != null) {
        obj[0].is_selected = obj[0].is_selected == true ? false : true;
      }
    }
    else if (checked_type == 'FrontalNames') {
      let obj = this.FrontalNames.filter((item: any) => (item.DeptId === childitem.DeptId));
      if (obj != null) {
        obj[0].is_selected = obj[0].is_selected == true ? false : true; 
        this.filterDesignation("Frontal",this.FrontalNames,"DeptId")
      }
    }
    else if (checked_type == 'Departments') {
      let obj = this.Departments.filter((item: any) => (item.DeptId === childitem.DeptId));
      if (obj != null) {
        obj[0].is_selected = obj[0].is_selected == true ? false : true;
        
        this.filterDesignation("Department",this.FrontalNames,"DeptId")
      }
    }
    else if (checked_type == 'Committees') {
      let obj = this.Committees.filter((item: any) => (item.DeptId === childitem.DeptId));
      if (obj != null) {
        obj[0].is_selected = obj[0].is_selected == true ? false : true; 
        this.filterDesignation("Committee",this.Committees,"DeptId")
      }
    }
  }
  filterDesignation(filterType:string,filterList:any,filterCol:string){ 
    this.Designations = this.AllDesignations; 
    let selectedlist :any=[];
    let isChecked = this.FrontalNames
        .filter((item: any) => item.is_selected == true)   
    if(isChecked.length>0){
       var _temp  = this.AllDesignations
      .filter((item: any) => item.IsFrontal == true)
      .map((item: any) =>  item.id)

      _temp.forEach((element:any) => {
        selectedlist.push(element);
        });
    }
      isChecked = this.Departments
    .filter((item: any) => item.is_selected == true)   
    if(isChecked.length>0){
      var _temp  = this.AllDesignations
     .filter((item: any) => item.IsDept == true)
     .map((item: any) =>  item.id) 
     
     _temp.forEach((element:any) => {
      selectedlist.push(element);
      });
   }
   isChecked = this.Committees
   .filter((item: any) => item.is_selected == true) 
   if(isChecked.length>0){
    var _temp = this.AllDesignations
   .filter((item: any) => item.IsCommittee == true)
   .map((item: any) =>  item.id) 
   
   _temp.forEach((element:any) => {
    selectedlist.push(element);
    });

 } 
    // selectedlist.forEach((element:any) => {
    //   filteredData.push(...element);
    // });
    // const uniq = filteredData.reduce((uniqArr:any, item:any) => {
    //   return uniqArr.includes(item) ? uniqArr : [...uniqArr, item]}
    //   ,[]
    //   ); 
  if(selectedlist.length>0){
    this.Designations= this.AllDesignations.filter(function(item:any) {
        return (
          selectedlist.indexOf(parseInt(item.id)) > -1
        );
      }); 
      let el: any = document.getElementById('headingOne');
      el.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
    }
    else{
      this.Designations=this.AllDesignations;
    }
  }

  showTab(tab_type: any) {
    this.Designations = this.AllDesignations;
    this.current_tab=tab_type;
    let isExists = this.FilterTabs.filter((item: any) => (item.page_name.toLowerCase() == 'congress_organisation' &&
    item.tab_name !=null && item.tab_name.toLowerCase() == tab_type.toLowerCase() && item.is_active == true &&
    item.filter_by!=null && item.filter_by.toLowerCase() == "designation"))

    if (isExists.length > 0) {
      var a12=$.map(isExists[0].filter_on.split(','), function(value){
        return parseInt(value, 10); 
    }); 
      var filteredData = this.Designations.filter(function (item: any) {
        return (
          a12.indexOf(parseInt(item.id)) > -1
        );
      });
      if (filteredData.length > 0) {
        this.Designations = filteredData
      }
    }
    this._v12(tab_type) 
    this.clearCheckedResult(this.Designations,'');
    this.clearCheckedResult(this.States,'');
    this.clearCheckedResult(this.Districts,'');
    this.clearCheckedResult(this.FrontalNames,'');
    this.clearCheckedResult(this.Committees,'');
    this.clearCheckedResult(this.Departments,'');
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
    this.dataTables.push({"Name":"SC", "Data":this.Users.filter((item: any) => (item.did === 7 && item.hid === 1))});
    this.dataTables.push({"Name":"ST", "Data":this.Users.filter((item: any) => (item.did === 8 && item.hid === 1))});
    this.dataTables.push({"Name":"OBC", "Data":this.Users.filter((item: any) => (item.did === 9 && item.hid === 1))});
    this.dataTables.push({"Name":"Minority", "Data":this.Users.filter((item: any) => (item.did === 10 && item.hid === 1))});
  } 
  viewDetails(access_token: any) {
    window.location.href = "/user-profile/" + access_token;
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
          this.Committees = parseresponse.Table7.filter((item: any) => item.Type == 'C');
          this.FrontalNames = parseresponse.Table7.filter((item: any) => item.Type == 'F');
          this.Departments = parseresponse.Table7.filter((item: any) => item.Type == 'D');
          this.AllDesignations = parseresponse.Table2;
          this.States = parseresponse.Table1;
          this.Districts = this.DistrictsList = parseresponse.Table4;

          this.FilterTabs  = parseresponse.Table5;
          this.FilterSection = parseresponse.Table6;
          this._v12("AICC");
        } else {
          this.Designations = [];
          this.States = [];
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
  _v12(tab_name:string){

    let cofilter=this.FilterTabs.filter((item: any) => item.page_name == 'congress_organisation' && item.tab_name==tab_name);
    this.FilterOptions.Designation = this.FilterOptions.State= 
    this.FilterOptions.District= this.FilterOptions.Committees=this.FilterOptions.Departments= this.FilterOptions.frontals=false;       
    
    if (cofilter != null && cofilter.length > 0) {
      var option = cofilter[0].filter_section_name.split(',')
      let temp = option.filter((item: any) => item.toLowerCase() == 'designation');
      if (temp != null && temp.length > 0) {
        this.FilterOptions.Designation = true;
      }
      temp = option.filter((item: any) => item.toLowerCase() == 'state');
      if (temp != null && temp.length > 0) {
        this.FilterOptions.State = true;
      }
      temp = option.filter((item: any) => item.toLowerCase() == 'district');
      if (temp != null && temp.length > 0) {
        this.FilterOptions.District = true;
      }
      temp = option.filter((item: any) => item.toLowerCase() == 'committees');
      if (temp != null && temp.length > 0) {
        this.FilterOptions.Committees = true;
      }
      temp = option.filter((item: any) => item.toLowerCase() == 'frontals');
      if (temp != null && temp.length > 0) {
        this.FilterOptions.frontals = true;
      }
      temp = option.filter((item: any) => item.toLowerCase() == 'departments');
      if (temp != null && temp.length > 0) {
        this.FilterOptions.Departments = true;
      }
    }
  }
  LoadDistrictsByState(stateId: string) {
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
  onAllCheckedResult(list: any, listType: any) {
    list.forEach((element: any) => {
      element.is_selected = element.is_selected == true ? false : true;
    });

  }
  clearCheckedResult(list: any, listType: any) {
    list.forEach((element: any) => {
      element.is_selected = false;
    });

  }
  LoadUsers(filtertext: string) {
    const objRequest = {
      typeId: 8,
      userid: 0,
      filterId: 0,
      filterText: filtertext,
      filterText1: ""
    };

    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {
        $.each($(".nexagrid-basic-example"), function (ind, val) {
          $(val).DataTable().destroy();
        })
        let el: any = document.getElementById('AICC');
        el.scrollIntoView();
        if (response["errorCode"] === "200") {
          var parseresponse = JSON.parse(response.response); 
          if(filtertext.length>0){   
            let _filterTab=this.dataTables.filter((item: any) => (item.Name.toLowerCase() === this.current_tab.toLowerCase()));
            if(_filterTab && _filterTab.length>0){
              _filterTab[0].Data=parseresponse.Table;
              if(this.current_tab=="AICC")
              _filterTab[0].Data=_filterTab[0].Data.filter((item: any) => (item.hid === 1));
              if(this.current_tab=="PCC")
              _filterTab[0].Data=_filterTab[0].Data.filter((item: any) => (item.hid === 2));
              if(this.current_tab=="DCC")
              _filterTab[0].Data=_filterTab[0].Data.filter((item: any) => (item.hid === 3));
              if(this.current_tab=="SC")
              _filterTab[0].Data=_filterTab[0].Data.filter((item: any) => (item.did === 7 && item.hid === 1));
              if(this.current_tab=="ST")
              _filterTab[0].Data=_filterTab[0].Data.filter((item: any) => (item.did === 8 && item.hid === 1));
              if(this.current_tab=="OBC")
              _filterTab[0].Data=_filterTab[0].Data.filter((item: any) => (item.did === 9 && item.hid === 1));
              if(this.current_tab=="Minority")
              _filterTab[0].Data=_filterTab[0].Data.filter((item: any) => (item.did === 10 && item.hid === 1)); 
            } 
          }
          else{
            this.Users = parseresponse.Table;
            this.UsersList = parseresponse.Table;
            this._v123 ();
          }
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

          if(filtertext.length>0){
            let _filterTab=this.dataTables.filter((item: any) => (item.Name.toLowerCase() === this.current_tab.toLowerCase()))[0];
            if(_filterTab && _filterTab.length>0){
              _filterTab[0].Data=[];
            }
          }
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
  showmore(type: any) {
    if (type == 'states') {
      this.StatesLimit = this.States.length;
    }
    else if (type == 'designation') {
      this.DesignationLimit = this.Designations.length;
    }
    else if (type == 'departments') {
      this.DepartmentLimit = this.Departments.length;
    }
    else if (type == 'districts') {
      this.DistrictsLimit = this.Districts.length;
    }
  }
  showless(type: any) {
    if (type == 'states') {
      this.StatesLimit = 5;
    }
    else if (type == 'designation') {
      this.DesignationLimit = 5;
    }
    else if (type == 'departments') {
      this.DepartmentLimit = 5;
    }
    else if (type == 'districts') {
      this.DistrictsLimit = 5;
    }
  }
  filter() {
    $('.acc_filter').toggle();

  }
  backtohome() {
    window.location.href = "/dashboard";
  }
}
