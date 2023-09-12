import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SessionService } from 'src/app/services/session.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environement/environment';
import { UtilService } from 'src/app/services/util.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-realtor-management',
  templateUrl: './realtor-management.component.html',
  styleUrls: ['./realtor-management.component.css']
})
export class RealtorManagementComponent implements OnInit {
  pageTitle:string = 'realtor'
  isLoading:boolean = false
  serverAPI:string = environment.serverAPI

  displayedColumns: string[] = ['image', 'id', 'name', 'email', 'phone', 'actions'];
  dataSource:any
  constructor(
    public dialog: MatDialog,
    private session: SessionService,
    private localstorage: LocalstorageService,
    private http: HttpClient,
    private util: UtilService
  ){

  }
  
  async ngOnInit() {
      await this.session.checkSession()
      await this.getRealtors()
  }


 
  openTerminateRealtor(data:any){
    const terminatedialogRef = this.dialog.open(DialogTerminateRealtor, {
      data: data
    });
    terminatedialogRef.afterClosed().subscribe(result => {
      if(result){
        // console.log(result)
        this.terminateRealtor(result)
        
      }
    });
  }
  async terminateRealtor(data:any){
    const accessToken = await this.localstorage.getData('accessToken')
    const options = {
      headers:{
        'authorization':`Bearer ${accessToken}`
      }
    }

    if(data.rltr_id != null){
      this.isLoading = true

      let formData = {
        id:data.rltr_id
      }

      const response = this.http.patch(`${this.serverAPI}/api/realtor/terminate`, formData, options).toPromise()
      const loadingTime = new Promise(resolve => setTimeout(resolve, environment.loadingtime))


      return await Promise.all([response,loadingTime]).then(
        ([response]:any)=>{
          this.isLoading = false
          this.util.openSnackBar(response.message,"OK")
          this.getRealtors()
        },
        (error) => {
          this.isLoading = false
          console.error("Error terminating realtor account", error)
          this.util.openSnackBar(error.error.message, "OK")
        }
      )
    }
    else{
      this.util.openSnackBar("Realtor data not present", "OK")
    }
  }

  async getRealtors() {
    this.isLoading = true
    const accessToken = await this.localstorage.getData('accessToken')

    const options = {
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    }
    const response = this.http.get(`${environment.serverAPI}/api/realtor/`, options).toPromise()
    const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))
    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false
        if(response.success == true){
          this.dataSource = response.data
          // console.log(response.data)
        }
        else{
          this.util.openSnackBar(response.message, "OK")
        }
        
      },
      (error: any) => {
        this.isLoading = false
        console.error("Error fetching realtors", error)
        this.util.openSnackBar(error.error.message, "OK")
      }
    )
  }


  viewRealtor(data:[]) {
    // console.log(data)
    const viewdialogRef = this.dialog.open(DialogViewRealtor, {
      data: data
    });
    viewdialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updateRealtor(result)
        // console.log(result)
      }
    });
  }

  async updateRealtor(data:any){
    const accessToken = await this.localstorage.getData('accessToken')
    const options = {
      headers:{
        'authorization':`Bearer ${accessToken}`
      }
    }

    if(data.rltr_fname != "" && data.rltr_lname != "" && data.rltr_email != "" && data.rltr_phone != "" 
      && data.rltr_status != "" && data.rltr_id != null  && data.rltr_birthdate != null
    ){
      this.isLoading = true
      let formData = {
        id:data.rltr_id,
        email:data.rltr_email,
        fname:data.rltr_fname,
        mname:data.rltr_mname,
        lname:data.rltr_lname,
        phone:data.rltr_phone,
        birthdate:data.rltr_birthdate,
        status:data.rltr_status,
      }
  
      const response  = this.http.patch(`${environment.serverAPI}/api/realtor/`, formData, options).toPromise()
      const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))
  
      return await Promise.all([response,loadingPromise]).then(
        ([response]:any) => {
          this.isLoading = false
          this.getRealtors()
          this.util.openSnackBar(response.message, "OK")
  
        },
        (error:any) => {
          this.isLoading = false
          console.error("Error updating realtor", error)
          this.util.openSnackBar(error.error.message, "OK")
        }
      )
    }
    else{
      this.isLoading = false
      this.util.openSnackBar("Do not leave the important fields empty except for Middlename", "OK" )
    }


  }


}

@Component({
  selector: 'view-realtor-dialog',
  templateUrl: 'view-realtor-dialog.html',
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule,MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule ,MatNativeDateModule],
})
export class DialogViewRealtor {
  allowEdit:boolean = false
  serverAPI:string = environment.serverAPI
  constructor(
    public dialogRef: MatDialogRef<DialogViewRealtor>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'terminate-realtor-dialog',
  templateUrl: 'terminate-realtor-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
})
export class DialogTerminateRealtor {
  constructor(
    public dialogRef: MatDialogRef<DialogTerminateRealtor>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }


}

