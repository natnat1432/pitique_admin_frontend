import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { SessionService } from 'src/app/services/session.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/app/environement/environment';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() page: string | undefined;
  firstname:any = ''
  middlename:any = ''
  lastname:any = ''
  position:any = ''
  isLoading:boolean = false
  email:any = ''
  url:any = ''
  serverAPI = environment.serverAPI

  constructor(
      private router:Router,
      private localstorage:LocalstorageService,
      private session:SessionService,
      public util:UtilService
    ){
  
    }

  async ngOnInit() {
      this.firstname = await  this.localstorage.getData('fname')
      this.middlename = await  this.localstorage.getData('mname')
      this.lastname =  await this.localstorage.getData('lname')
      this.position =  await this.localstorage.getData('user_type')
      this.email = await this.localstorage.getData('email')

  }

  navigateDashboard(){
    this.router.navigate(['/dashboard'])
  }
  navigateAdminManagement(){
    this.router.navigate(['/admin-management'])
  }
  navigateRealtorManagement(){
    this.router.navigate(['/realtor-management'])
  }
  navigatePitiqueManagement(){
    this.router.navigate(['/pitique-management'])
  }
  navigateBookingManagement(){
    this.router.navigate(['/booking-management'])
  }
  navigatePaymentManagement(){
    this.router.navigate(['/payment-management'])
  }
  navigateProfile(){
    this.router.navigate(['/profile'])
  }

  async logout(){
    this.isLoading = true
 
    try{
      const delayInMilliseconds:any = 2000;
      setTimeout(async()=> {
        await this.session.logout()
      },delayInMilliseconds)
    }
    catch(error){
      console.error("Error logging out", error)
      this.isLoading = false
      this.util.openSnackBar("Error logging out", "OK")

    }
    
  }

  


  // async checkImage() {
  //   const imageUrl = `${environment.serverAPI}/api/admin/${this.email}/profileImage`;
  //   const img = new Image();

  //   if(img.onload){
  //     this.url = `${environment.serverAPI}/api/admin/${this.email}/profileImage`;
  //   }
  //   else{
  //     // Image doesn't exist
  //     this.url = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
  //   }
  //   // Load the image by setting the src
  //   img.src = imageUrl;
  // }
  


}
