import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { Meetingsservice } from '../meetings.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'addmessage', 
  templateUrl: './addmessage.component.html',
  styleUrl: './addmessage.component.scss'
})
export class AddmessageComponent implements OnInit {
  searchQuery: string = ''; // Input query for searching
  allUsers: { id: number; name: string }[] = []; // Filtered user list
  filteredUsers: { id: number; name: string }[] = []; // Filtered user list
  selectedUsers: { id: number; name: string }[] = []; // Selected users
  meetingId: number | null = null;
  SenderList: any = [];
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
  todayDate: string='';
  isLoggedIn:any='';
  selectedOption: number = 1;
  isonline: number = 0;
  expandedPanels: { [key: string]: boolean } = {};
  clsinvite:cls_addmessage=new cls_addmessage();
  constructor(private route: ActivatedRoute,private service:Meetingsservice, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0]; // Extracts the date part
  }
  ngOnInit() {  
    debugger;
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    this.getLookupMaster(0);
    this.getActivityMaster(0);
    this.getOrganizer(0);
    this.getAllUsers(0);
     // Retrieve 'id' from query parameters (e.g., ?id=4)
     this.route.queryParams.subscribe(params => {
      this.meetingId = params['id']; // Get the 'id' query parameter
      this.loadMeetingData(this.meetingId); // Call method to load data using the 'id'
    });

    // Alternatively, if the 'id' is part of the route path (e.g., /meetings/:id)
    // this.route.snapshot.paramMap.get('id'); // For route parameters
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
    debugger;
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
  loadMeetingData(id: number | null): void {
    if (id) {
      console.log('Load data for meeting with id:', id);
      const objRequest = {
        typeId: 13,
        userid: 0,
        filterId: id,
        filterText: "",
        filterText1: ""
      };
    
      this.service.getMasters(objRequest).subscribe({
        next: (response: any) => { 
          const parseresponse = JSON.parse(response.response); 
          console.log(parseresponse);

          debugger;
          this.clsinvite.id= id;
          this.clsinvite.sender_id= parseresponse.Table[0].sender_id;
          this.clsinvite. msg_date= parseresponse.Table[0].date.split('T')[0]; // Format to YYYY-MM-DD
          this.clsinvite.msg_time= parseresponse.Table[0].time.split(' ')[0];
          this.clsinvite.created_by= parseresponse.Table[0].created_by;
          this.clsinvite.desc= parseresponse.Table[0].desc;
          this.clsinvite.title= parseresponse.Table[0].title;
          this.clsinvite.imageFile= parseresponse.Table[0].imageFile;
          this.clsinvite.imagePath= parseresponse.Table[0].imagePath;
           // Update the designations based on the API response
          this.updateDesignationsList(parseresponse.Table2); 
// Update the organisation based on the API response
 this.updateOrganisationList(parseresponse.Table3);

        },
        error: (error: any) => {
          console.error("API call failed:", error);
        },
        complete: () => {
          console.log("API call completed.");
        }
      });
     }
  }

  backtohome(){
    window.location.href = "/meetings";
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
    if (this.clsinvite.sender_id == null  || this.clsinvite.sender_id === 0) {
      this.snackbar.showInfo("Please select Sender", "Error");
      validate = true;
    }
    else if(this.clsinvite.title == undefined || this.clsinvite.title == null || this.clsinvite.title == '') {
      this.snackbar.showInfo("Please enter title","Error");
      validate=true;
    }
    else if(this.clsinvite.msg_time == undefined || this.clsinvite.msg_time == null || this.clsinvite.msg_time == '') {
      this.snackbar.showInfo("Please enter time","Error");
      validate=true;
    }
    else if(this.clsinvite.msg_date == undefined || this.clsinvite.msg_date == null || this.clsinvite.msg_date == '') {
      this.snackbar.showInfo("Please select date ","Error");
      validate=true;
    }
  
   
    else if(this.clsinvite.desc == undefined || this.clsinvite.desc == null || this.clsinvite.desc == '') {
      this.snackbar.showInfo("Please enter your description","Error");
      validate=true;
    }
    else if(this.clsinvite.imageFile == undefined || this.clsinvite.imageFile == null || this.clsinvite.imageFile == '') {
      this.snackbar.showInfo("Please select image","Error");
      validate=true;
    }
    else if (this.clsinvite.participants == null || this.clsinvite.participants.length === 0) {
      this.snackbar.showInfo("Please Select Participants", "Error");
      validate = true;
    }
    else if (this.clsinvite.designations == null || this.clsinvite.designations.length === 0) {
      this.snackbar.showInfo("Please Select Designations", "Error");
      validate = true;
    }
   if(!validate) {
    $(".page-loader-wrapper-review").show(); 
  const formData = new FormData();
     // Append form fields
     formData.append('id', this.clsinvite.id.toString());
     formData.append('sender_id', this.clsinvite.sender_id.toString());
     formData.append('created_by', '1');
     formData.append('msg_date', this.clsinvite.msg_date.toString());
     formData.append('msg_time', this.clsinvite.msg_time.toString());
     formData.append('desc', this.clsinvite.desc.toString());
     formData.append('title', this.clsinvite.title.toString());
     formData.append('imageFile', this.clsinvite.imageFile);
     formData.append('imagePath', "https://ldmrc_api.pulseadmin.in/__DIR\Attachments\f9dc32a6-5a47-438e-82e8-be781921d72d.png");
     formData.append('designations', this.clsinvite.designations.toString());
     formData.append('participants', this.clsinvite.participants.toString());

        // Append file only if it exists
        if (this.clsinvite.imageFile && this.clsinvite.imageFile instanceof File) {
         formData.append('imageFile', this.clsinvite.imageFile);
       }
     if (this.clsinvite.id != 0) {
       formData.append('id', this.clsinvite.id.toString());
       formData.delete('imageFile'); 
   }
 this.service.SaveMessage(formData).subscribe((res: any) => {
   setTimeout(() => {
     $(".page-loader-wrapper-review").hide();
   }, 500);
   var response = res;
   if (response._body.errorCode == "200") {
      this.snackbar.showSuccess(response._body.message, response._body.status);
     setTimeout(() => {
       this.clsinvite = new cls_addmessage(); // Reset form data
     }, 3000);
    
   } else {
     this.snackbar.showInfo(response._body.message, "Error");
   }
 });
  
   }
    
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
        const parseresponse = JSON.parse(response.response); 
        this.designationsList = parseresponse.Table2;
      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
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
         console.log(this.categories1);
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
       console.log(this.SenderList);

      },
      error: (error: any) => {
        console.error("API call failed:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  updateDesignations(designation: any): void {
    debugger;
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
onFileChange(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsinvite.imageFile = file; // Assign File object
    }
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

