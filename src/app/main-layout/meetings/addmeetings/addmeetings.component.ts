import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import 'jquery';
import { Router } from '@angular/router';
import { Meetingsservice } from '../meetings.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'addmeetings', 
  templateUrl: './addmeetings.component.html',
  styleUrl: './addmeetings.component.scss'
})
export class AddmeetingsComponent implements OnInit {
  meetingId: number | null = null;
  OrganisersList: any = [];
  responseid:any=[];
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
  // selectedOption: number = 1;
  // isonline: number = 0;
  isonline: string = '';
  selectedOption: string = '';

  expandedPanels: { [key: string]: boolean } = {};
  clsinvite:cls_addmeeting=new cls_addmeeting();
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
     // Retrieve 'id' from query parameters (e.g., ?id=4)
     this.route.queryParams.subscribe(params => {
      this.meetingId = params['id']; // Get the 'id' query parameter
      // this.loadMeetingData(this.meetingId); // Call method to load data using the 'id'
      if (this.meetingId && this.meetingId !== 0) {
        if (this.meetingId === this.responseid) {
          window.location.href = "/profile";
        } else {
          this.loadMeetingData(this.meetingId); // Call method to load data using the 'id'
        }
      } else {
        console.error('Invalid or missing Activity ID');
      }
    
    });

    // Alternatively, if the 'id' is part of the route path (e.g., /meetings/:id)
    // this.route.snapshot.paramMap.get('id'); // For route parameters
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
          this.clsinvite.is_reschdule= id;
          this.clsinvite.title= parseresponse.Table[0].title;
          this.clsinvite. date= parseresponse.Table[0].date.split('T')[0]; // Format to YYYY-MM-DD
          this.clsinvite.time= parseresponse.Table[0].time.split(' ')[0];
          this.clsinvite.organizer_id= parseresponse.Table[0].organizer;
          this.clsinvite.notification_type= parseresponse.Table[0].notif_type;
          this.clsinvite.duration= parseresponse.Table[0].notif_duration;
          this.clsinvite.duration_type= parseresponse.Table[0].notif_durationType;
          this.clsinvite.description= parseresponse.Table[0].description;
          this.clsinvite.meeting_link= parseresponse.Table[0].meeting_link;
          this.clsinvite.meeting_location= parseresponse.Table[0].meeting_location;
          this.clsinvite.short_desc= parseresponse.Table[0].short_desc;
          this.clsinvite.isonline= parseresponse.Table[0].isonline;
          this.selectedOption = this.clsinvite.isonline; // Bind to the selectedOption model
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
  onOptionChange() {
    debugger;
    this.clsinvite.isonline = this.selectedOption === '0' ? '0' : '1';
    //  this.clsinvite.isonline = Number(this.selectedOption) === 0 ? 0 : 1;
    
  }
  cancel() {
    this.clsinvite.title='';
    this.clsinvite.date= '';
    this.clsinvite.time=''; 
    this.clsinvite.notification_type=0;
    this.clsinvite.duration = 0;
    this.clsinvite.description = '';
    // this.clsinvite.isonline=0;
    this.clsinvite.meeting_location='';
    this.clsinvite.meeting_link='';
    this.clsinvite.short_desc='';
    this.clsinvite.is_reschdule=0;
    this.clsinvite.created_by=1;
    this.clsinvite.duration_type='';
    this.clsinvite.designations=[];
    this.clsinvite.participants=[];
    this.clearDesignations();
    this.clearParticipants();
    this.clsinvite.organizer_id =0;
    
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
    if (this.clsinvite.isonline == null) {
      this.snackbar.showInfo("Please select Meeting", "Error");
      validate = true;
    }
    else if(this.clsinvite.title == undefined || this.clsinvite.title == null || this.clsinvite.title == '') {
      this.snackbar.showInfo("Please enter title","Error");
      validate=true;
    }
    else if(this.clsinvite.time == undefined || this.clsinvite.time == null || this.clsinvite.time == '') {
      this.snackbar.showInfo("Please enter time","Error");
      validate=true;
    }
    else if(this.clsinvite.date == undefined || this.clsinvite.date == null || this.clsinvite.date == '') {
      this.snackbar.showInfo("Please select date ","Error");
      validate=true;
    }
  
    else if(this.clsinvite.notification_type == undefined || this.clsinvite.notification_type == null || this.clsinvite.notification_type == 0) {
      this.snackbar.showInfo("Please select your notification","Error");
      validate=true;
    }
    else if(this.clsinvite.duration == undefined || this.clsinvite.duration == null || this.clsinvite.duration == 0) {
      this.snackbar.showInfo("Please enter your duration","Error");
      validate=true;
    }
    else if(this.clsinvite.duration_type == undefined || this.clsinvite.duration_type == null || this.clsinvite.duration_type == '') {
      this.snackbar.showInfo("Please select  your duration type","Error");
      validate=true;
    }
    else if(this.clsinvite.description == undefined || this.clsinvite.description == null || this.clsinvite.description == '') {
      this.snackbar.showInfo("Please enter your description","Error");
      validate=true;
    }
    else if(this.clsinvite.short_desc == undefined || this.clsinvite.short_desc == null || this.clsinvite.short_desc == '') {
      this.snackbar.showInfo("Please enter your Shot description","Error");
      validate=true;
    }
    else if(this.clsinvite.organizer_id == undefined || this.clsinvite.organizer_id == null || this.clsinvite.organizer_id == 0) {
      this.snackbar.showInfo("Please Select Organisers","Error");
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
    this.service.InviteClient(this.clsinvite).subscribe((res: any) => {
      setTimeout(() => {
        $(".page-loader-wrapper-review").hide();
      }, 500);
      debugger;
      var response = res;
      if (response["errorCode"] == "200") {
        debugger;
        this.snackbar.showSuccess(response.message,response.status);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);

        setTimeout(() => {
          this.responseid=JSON.parse(response.response).Table[0].id;
          // this.meetingId = this.route.snapshot.paramMap.get('id');
          if (this.meetingId && this.meetingId!== 0) {
            if (this.meetingId === this.responseid.toString()) {
              window.location.href = "/meetings";
            } 
          }
          this.clsinvite=new cls_addmeeting();// Reset form data
          this.cancel();
        }, 1000);

      }
      else {
        // console.error("API returned an error:", response.message); 
        this.snackbar.showInfo(response["message"],"Error");
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
        this.OrganisersList = parseresponse.Table;
       console.log(this.OrganisersList);

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
    // If activities are a string, parse them into objects
    if (typeof organisation.activities === 'string') {
      organisation.activities = JSON.parse(organisation.activities);
    }
    const Editactivities: { id: number, title: string, activity_type: number }[] = JSON.parse(apiResponse[0].activities);
debugger;
     organisation.activities.forEach(activity => {
    // Set Activityselected to true if the activity ID exists in the parsed activities
    activity.Activityselected = Editactivities.some((apiActivity: { id: number }) => apiActivity.id === activity.id);
      // If the activity is selected, add it to the participants array (if not already present)
      if (activity.Activityselected) {
        const selectedOrganisation = { id: activity.id };
        if (!this.clsinvite.participants.some(d => d.id === activity.id)) {
          this.clsinvite.participants.push(selectedOrganisation);
        }
      } else {
        // If the activity is unselected, remove it from the participants array (if present)
        this.clsinvite.participants = this.clsinvite.participants.filter(d => d.id !== activity.id);
      }
    });

    // Track whether the entire category is selected based on its activities
    organisation.selected = organisation.activities.some(activity => activity.Activityselected);
  });
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


export class cls_addmeeting {
  constructor(){

  }
  title: string='';
  date: string= '';
  time:string=''; 
  notification_type:number=0;
  duration:number = 0;
  description: string = '';
  // isonline:number=0;
  isonline:string='';

  meeting_location:string='';
  meeting_link:string='';
  short_desc:string='';
  is_reschdule:number=0;
  created_by:number=1;
  duration_type:string='';
      designations: { id: string }[] = [];
    participants: { id: number }[] = [];
    organizer_id :number=0;
}

