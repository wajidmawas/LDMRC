import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { Meetingsservice } from '../../meetings/meetings.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {

  designationsList: { id: string,name : string, selected: boolean }[] = [];
  categories1: {
    id: number;
    name: string;
    activities: {
      id: number;
      title: string;
      activity_type: number;
      Activityselected: boolean;
    }[];
    selected: boolean;
  }[] = [];
  SenderList: any = [];
  remainingText:number=0;
  isLoggedIn:any ='';
  userdetails:any={};
  selectedmeeting: any = null;
  searchValue:any='';
  messages: Message[] = [];
  searchQuery: string = ''; // Input query for searching
  clsinvite:cls_addmessage=new cls_addmessage();
  expandedPanels: { [key: string]: boolean } = {};
  allUsers: { id: number; name: string }[] = []; // Filtered user list
  filteredUsers: { id: number; name: string }[] = []; // Filtered user list
  selectedUsers: { id: number; name: string }[] = []; // Selected users
  constructor(private service:Meetingsservice, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper").fadeOut();
    }, 300);
    const today = new Date();
  }
  ngOnInit() {  
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    this.userdetails = JSON.parse(this.isLoggedIn) 
    this.getmymessage(this.userdetails.user_id)
    this.getActivityMaster(0);
    this.getOrganizer(0);
    this.getAllUsers(0);
  }
  getAllUsers(id: any) {
    const objRequest = {
      typeId: 29,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        const parseresponse = JSON.parse(response.response); 
        this.allUsers = parseresponse.Table;
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
   // Filter users based on the search query
   filterUsers() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query === '') {
      this.filteredUsers = [];
      return;
    }
    this.filteredUsers = this.allUsers.filter((user) =>
      user.name.toLowerCase().includes(query)
    );
  }

  // Add a user to the selected list
  addUser(user: { id: number; name: string }) { 
    if (!this.selectedUsers.some((u) => u.id === user.id)) {
      this.selectedUsers.push(user);
    }
    this.searchQuery = ''; // Clear search input
    this.filteredUsers = []; // Clear filtered list
  }

  // Remove a user from the selected list
  removeUser(user: { id: number; name: string }) {
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
  }
  // Get all selected user IDs (for further processing)
  getSelectedUserIds(): number[] {
    return this.selectedUsers.map((user) => user.id);
  }
  isExpanded(panelName: string): boolean {
    return !!this.expandedPanels[panelName];
  }
  toggleCollapse(panelName: string) {
    this.expandedPanels[panelName] = !this.expandedPanels[panelName];
  }
  getActivityMaster(id: any) {
    const objRequest = {
      typeId: 18,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
         const parseresponse = JSON.parse(response.response); 
 const categoriesWithActivities = parseresponse.Table2;
// Step 2: Process the parsed data into the desired format
this.categories1 = (categoriesWithActivities|| []).map((category: any) => ({
  id: category.id,
  name: category.name,
  selected: false,  // Initialize selected as false for all categories
  activities: (JSON.parse(category.activities) || []).map((activity: any) => ({
    id: activity.id,
    title: activity.title,
    activity_type: activity.activity_type.toString(),
    Activityselected: false  // Initialize Activityselected as false for all activities
  }))
}));
          
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  getOrganizer(id: any) {
    const objRequest = {
      typeId: 8,
      userid: 0,
      filterId: id,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        const parseresponse = JSON.parse(response.response); 
        this.SenderList = parseresponse.Table; 

      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  fillUsersByDept(sender:string){
    this.categories1.forEach(element => {
      $("#div_"+element.id).hide();
    });
    if(sender!=null && sender!=""){
      if(sender=="NCAICC"){
        $("#div_1").show();
      }
      if(sender=="SCAICC"){
        $("#div_7").show();
      }
      if(sender=="STAICC"){
        $("#div_8").show();
      }
      if(sender=="OBCINC"){
        $("#div_9").show();
      }
      if(sender=="MININC"){
        $("#div_10").show();
      }
    }
  }
  updateDesignations(designation: any): void {
   
    // Filter the selected designations
    if (designation.selected) {
      // Add the selected designation in the desired format
      const selectedDesignation = { id: designation.id };
      // Add it to the array if it's not already present
      if (!this.clsinvite.designations.some(d => d.id === designation.id)) {
        this.clsinvite.designations.push(selectedDesignation);
      }
    } else {
      // Remove the designation if it is unchecked
      this.clsinvite.designations = this.clsinvite.designations.filter(d => d.id !== designation.id);
    }
  }
  onCheckboxChange(event: any, activity: any) {
   
    activity.checked = event.checked;
      // Filter the selected designations
      if (activity.checked) {
        // Add the selected designation in the desired format
        const selectedOrganisation = { id: activity.id };
        // Add it to the array if it's not already present
        if (!this.clsinvite.participants.some(d => d.id === activity.id)) {
          this.clsinvite.participants.push(selectedOrganisation);
        }
      } else {
        // Remove the designation if it is unchecked
        this.clsinvite.participants = this.clsinvite.participants.filter(d => d.id !== activity.id);
      }
    console.log(this.clsinvite.participants);  // To verify
  }
  
updateDesignationsList(apiResponse: any[]): void {
  this.designationsList.forEach(designation => {
    // Mark as selected if the name matches a role in the API response
    designation.selected = apiResponse.some(role => 
      role.Role === designation.name && role.id === designation.id);
     // Add the selected designation in the desired format
     if (designation.selected) {
      const selectedDesignation = { id: designation.id };
   // Add it to the array if it's not already present
   if (!this.clsinvite.designations.some(d => d.id === designation.id)) {
     this.clsinvite.designations.push(selectedDesignation);
   }
  }

  });
  
}
updateOrganisationList(apiResponse: any[]): void {
  this.categories1.forEach(organisation => {
    // Parse activities if they are strings
    if (typeof organisation.activities === 'string') {
      organisation.activities = JSON.parse(organisation.activities || '[]');
    }

    // Find the corresponding organisation in the API response
    const apiOrg = apiResponse.find(apiOrg => apiOrg.id === organisation.id);

    if (apiOrg && apiOrg.activities) {
      // Parse API activities
      const Editactivities: { id: number, title: string, activity_type: number }[] = JSON.parse(apiOrg.activities);

      organisation.activities.forEach(activity => {
        // Check if the activity exists in the API activities
        activity.Activityselected = Editactivities.some(apiActivity => apiActivity.id === activity.id);

        // Manage the participants list based on activity selection
        if (activity.Activityselected) {
          // Add the activity to participants if not already added
          const selectedOrganisation = { id: activity.id };
          if (!this.clsinvite.participants.some(d => d.id === activity.id)) {
            this.clsinvite.participants.push(selectedOrganisation);
          }
        } else {
          // Remove unselected activities from participants
          this.clsinvite.participants = this.clsinvite.participants.filter(d => d.id !== activity.id);
        }
      });

      // Update organisation-level selection status
      organisation.selected = organisation.activities.some(activity => activity.Activityselected);
    } else {
      // If no activities are provided in the API response, clear the activities
      organisation.activities = [];
      organisation.selected = false;
    }
  });
}
   
  getmymessage(id: number) { 
    const objRequest = {
      typeId: 31,
      userid: id,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
         const parseresponse = JSON.parse(response.response); 
        this.messages = parseresponse.Table; 
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  sanitizeFilePath(filePath: string) {
    // Fix backslashes in URLs and sanitize for safe rendering
    return filePath.replace(/\\/g, '/');
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
    
  viewmeeting(accesstoken:string){ 
    window.location.href = "/meeting_detail/"+accesstoken; 
  }
  valueChange(value:any) {
    this.remainingText = 320 - value.length;
   }
  selectAllActivities(category: any) {
    category.activities.forEach((activity: any) => {
      activity.Activityselected = category.selected;
      if (activity.Activityselected) {
        // Add the selected designation in the desired format
        const selectedOrganisation = { id: activity.id };
        // Add it to the array if it's not already present
        if (!this.clsinvite.participants.some(d => d.id === activity.id)) {
          this.clsinvite.participants.push(selectedOrganisation);
        }
      } else {
        // Remove the designation if it is unchecked
        this.clsinvite.participants = this.clsinvite.participants.filter(d => d.id !== activity.id);
      }
    });
    console.log( this.clsinvite.participants);
  }
  cancel() {
    this.clsinvite.sender_id=0;
    this.clsinvite.id= 0;
    this.clsinvite.created_by=0; 
    this.clsinvite.msg_date='';
    this.clsinvite.msg_time = '';
    this.clsinvite.desc = '';
    this.clsinvite.title='';
    this.clsinvite.imageFile='';
    this.clsinvite.imagePath='';
    this.clsinvite.designations=[];
    this.clsinvite.participants=[];
    this.clearDesignations();
    this.clearParticipants();
  }
  // Clear the designations checkboxes
clearDesignations() {
  this.designationsList.forEach(designation => {
    designation.selected = false;  // Clear the selection for each designation
  });
}

// Clear the participants checkboxes
clearParticipants() {
  this.categories1.forEach(category => {
    category.selected = false;  // Clear the selection for each category
    category.activities.forEach(activity => {
      activity.Activityselected = false;  // Clear the selection for each activity
    });
  });
}
  invite() {
     var validate:boolean=false;
    if(this.clsinvite.title == undefined || this.clsinvite.title == null || this.clsinvite.title == '') {
      this.snackbar.showInfo("Please enter sender","Error");
      validate=true;
    } 
    else if(this.clsinvite.desc == undefined || this.clsinvite.desc == null || this.clsinvite.desc == '') {
      this.snackbar.showInfo("Please enter your sms text","Error");
      validate=true;
    }
     
    else if (this.clsinvite.participants == null || this.clsinvite.participants.length === 0) {
      this.snackbar.showInfo("Please select participants", "Error");
      validate = true;
    } 
   if(!validate) {
    $(".page-loader-wrapper-review").show(); 
  const formData = new FormData();
     // Append form fields
     formData.append('id', this.clsinvite.id.toString());
     formData.append('sender_id', this.userdetails.user_id.toString());
     formData.append('created_by', this.userdetails.user_id.toString());
     formData.append('msg_date', new Date().toDateString());
     formData.append('msg_time', '');
     formData.append('desc', this.clsinvite.desc.toString());
     formData.append('title', this.clsinvite.title.toString());
     formData.append('imageFile', '');
     formData.append('imagePath', '');
     formData.append('participants', JSON.stringify(this.clsinvite.participants));
     formData.append('designations', JSON.stringify(this.clsinvite.designations));
     if (this.clsinvite.id != 0) {
       formData.append('id', this.clsinvite.id.toString());
       formData.delete('imageFile'); 
   }
 this.service.SaveMessage(formData).subscribe({
  next: (response: any) => {  
    setTimeout(() => {
      $(".page-loader-wrapper-review").hide();
    }, 500);
    var response = response;
    if (response.errorCode == "200") {
       this.snackbar.showSuccess(response.message, response.status);
      setTimeout(() => {
        this.clsinvite = new cls_addmessage(); // Reset form data
         this.clearDesignations();
         this.clearParticipants();
      }, 3000);
     
    } else {
      this.snackbar.showInfo(response.message, "Error");
    }
  },
  error: (error: any) => {
    console.error("API call failed:", error);
    this.snackbar.showInfo(error.error.errors, "Error");
  },
  complete: () => {
    console.log("API call completed.");
  }
});
 
  
   }
    
  }
  onSearchChange(tableid:string): void {  
    $("#tblMeeting").find("tbody tr").show()
    if(this.searchValue!=null && this.searchValue!=undefined && this.searchValue!=""){
      let searchkeyword=this.searchValue;
      $("#tblMeeting").find("tbody tr").each(function (ind, val) { 
            if ($(this).find("td")[2].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1 && 
                $(this).find("td")[3].innerText.toLowerCase().indexOf(searchkeyword.toLowerCase()) == -1) {
                $(this).hide();
            }
            else {
                $(this).show();
            } 
    });
   
    }
     
  }
     
}
 

export class cls_addmessage {
  constructor(){

  }
  id:number=0;
  sender_id:number=0;
  created_by:number=0;
  msg_date: string= '';
  msg_time:string=''; 
  desc: string = '';
  title: string='';
  imageFile: string | File = ''; // Allow both string and File
  imagePath:string='';
  designations: { id: string }[] = [];
  participants: { id: number }[] = [];
}


export interface Message {
  id: number;
  no_of_participants: number;
  msg_date: string;
  msg_time: string;
  sent_status: string;
  file_path: string;
  title: string;
  description: string;
  Datetime: string;
  Sender: string;
}

