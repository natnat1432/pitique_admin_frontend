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
@Component({
  selector: 'app-pitique-management',
  templateUrl: './pitique-management.component.html',
  styleUrls: ['./pitique-management.component.css']
})
export class PitiqueManagementComponent implements OnInit {
  pageTitle:string = 'pitique'
  isLoading:boolean = false
  serverAPI:string = environment.serverAPI
  displayedColumns: string[] = ['image', 'id', 'name', 'email', 'phone', 'actions'];
  dataSource: any
 
  add_pitiquer_data = {
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    phone: '',
    city:'',
    province:'',
    isphotog:false,
    isphotogedt:false,
    isvideog:false,
    isvideogedt:false,
    isamnty:false,
    isamntyedt:false,
    status: '',
    image: null,
  }

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
      await this.getPitiquers()
  }

  public clearInputs() {
    this.add_pitiquer_data.firstname = ''
    this.add_pitiquer_data.middlename = ''
    this.add_pitiquer_data.lastname = ''
    this.add_pitiquer_data.email = ''
    this.add_pitiquer_data.phone = ''
    this.add_pitiquer_data.city = ''
    this.add_pitiquer_data.province = ''
    this.add_pitiquer_data.isphotog = false,
    this.add_pitiquer_data.isphotogedt = false,
    this.add_pitiquer_data.isvideog = false,
    this.add_pitiquer_data.isvideogedt = false,
    this.add_pitiquer_data.isamnty = false,
    this.add_pitiquer_data.isamntyedt = false,
    this.add_pitiquer_data.status = ''
    this.add_pitiquer_data.image = null
  }

  
  addPitiquer(): void {
    const dialogRef = this.dialog.open(DialogAddPitiquer, {
      data: {
        adminData: this.add_pitiquer_data,
        clearInputs: this.clearInputs.bind(this)
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result != null) {
        this.registerPitiquer(result)
        // console.log(result)
      }
    });
  }

  async registerPitiquer(result: any) {
    this.isLoading = true
    if (result.email != null && result.firstname != null
      && result.lastname != null && result.phone != null &&
      result.city != null && result.province &&
      result.status != null) {
      const accessToken = await this.localstorage.getData('accessToken')

      const options = {
        headers: {
          'authorization': `Bearer ${accessToken}`
        }
      }

      const formData = new FormData()
      if (result.phone.length != 10 && result.phone.charAt(0) != '9' && result.phone != '') {
        this.isLoading = false
        this.util.openSnackBar("Invalid phone number format", "OK")
      }
      else {

      
      formData.append('email', result.email)
      formData.append('firstname', result.firstname)
      formData.append('middlename', result.middlename)
      formData.append('lastname', result.lastname)
      if (result.phone != '') formData.append('phone', "+63" + result.phone)
      formData.append('city', result.city)
      formData.append('province', result.province)
      formData.append('isphotog', result.isphotog)
      formData.append('isphotogedt', result.isphotogedt)
      formData.append('isvideog', result.isvideog)
      formData.append('isvideogedt', result.isvideogedt)
      formData.append('isamnty', result.isamnty)
      formData.append('isamntyedt', result.isamntyedt)
      formData.append('status', result.status)
      formData.append('image', result.image)

      const response = this.http.post(`${environment.serverAPI}/api/pitiquer/`, formData, options).toPromise()
      const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))
      return await Promise.all([response, loadingPromise]).then(
        (response: any) => {
          this.isLoading = false

          if (response[0].success == true) {
            this.util.openSnackBar("Pitiquer added successfully", "OK")
          }
          if(response[0].success == false && response[0].message == 'Pitiquer account already exists')
          {
            this.util.openSnackBar(response[0].message, "OK")
          }
          else {
            this.util.openSnackBar("Error adding admin", "OK")
          }
        }
      ).catch(error => {
        this.isLoading = false
        console.error("Error adding admin", error)
        this.util.openSnackBar(error.error.message, "OK")
      })
    }

    }
    else {
      this.isLoading = false
      this.util.openSnackBar("Please fill all the fields completely", "OK")
    }

  }

  async getPitiquers() {
    this.isLoading = true
    const accessToken = await this.localstorage.getData('accessToken')

    const options = {
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    }
    const response = this.http.get(`${environment.serverAPI}/api/pitiquer/`, options).toPromise()
    const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))
    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false
        if(response.success == true){
          this.dataSource = response.data
          console.log(response.data)
        }
        else{
          this.util.openSnackBar(response.message, "OK")
        }
        
      },
      (error: any) => {
        this.isLoading = false
        console.error("Error fetching pitiquers", error)
        this.util.openSnackBar(error.error.message, "OK")
      }
    )
  }

  viewPitiquer(data:[]) {
    const viewdialogRef = this.dialog.open(DialogViewPitiquer, {
      data: data
    });
    viewdialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updatePitiquer(result)
        console.log(result)
      }
    });
  }
  openTerminatePitiquer(data:[]) {
    const terminatedialogRef = this.dialog.open(DialogTerminatePitiquer, {
      data: data
    });
    terminatedialogRef.afterClosed().subscribe(result => {
      if(result){
        // console.log(result)
        this.terminatePitiquer(result)
        
      }
    });
  }

  async terminatePitiquer(data:any){
    const accessToken = await this.localstorage.getData('accessToken')
    const options = {
      headers:{
        'authorization':`Bearer ${accessToken}`
      }
    }

    if(data.ptqr_id != null){
      this.isLoading = true

      let formData = {
        id:data.ptqr_id
      }

      const response = this.http.patch(`${this.serverAPI}/api/pitiquer/terminate`, formData, options).toPromise()
      const loadingTime = new Promise(resolve => setTimeout(resolve, environment.loadingtime))


      return await Promise.all([response,loadingTime]).then(
        ([response]:any)=>{
          this.isLoading = false
          this.util.openSnackBar(response.message,"OK")
          this.getPitiquers()
        },
        (error) => {
          this.isLoading = false
          console.error("Error terminating pitiquer account", error)
          this.util.openSnackBar(error.error.message, "OK")
        }
      )
    }
    else{
      this.util.openSnackBar("Pitiquer data not present", "OK")
    }
  }

  async updatePitiquer(data:any){

    const accessToken = await this.localstorage.getData('accessToken')
    const options = {
      headers:{
        'authorization':`Bearer ${accessToken}`
      }
    }

    if(data.ptqr_fname != "" && data.ptqr_lname != "" && data.ptqr_email != "" && data.ptqr_phone != "" && data.ptqr_city != "" && data.ptqr_province != ""
      && data.ptqr_status != "" && data.ptqr_id != null 
    ){
      this.isLoading = true
      let formData = {
        id:data.ptqr_id,
        email:data.ptqr_email,
        firstname:data.ptqr_fname,
        middlename:data.ptqr_mname,
        lastname:data.ptqr_lname,
        phone:data.ptqr_phone,
        city:data.ptqr_city,
        province:data.ptqr_province,
        bio:data.ptqr_bio,
        isphotog:data.ptqr_isphotog,
        isphotogedt:data.ptqr_isphotogedt,
        isvideog:data.ptqr_isvideog,
        isvideogedt:data.ptqr_isvideogedt,
        isamnty:data.ptqr_isamnty,
        isamntyedt:data.ptqr_isamntyedt,
        status:data.ptqr_status,
      }
  
      const response  = this.http.patch(`${environment.serverAPI}/api/pitiquer/`, formData, options).toPromise()
      const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))
  
      return await Promise.all([response,loadingPromise]).then(
        ([response]:any) => {
          this.isLoading = false
          this.getPitiquers()
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
      this.util.openSnackBar("Do not leave the important fields empty except for Bio and Middlename", "OK" )
    }


}
}

@Component({
  selector: 'add-pitiquer-dialog',
  templateUrl: 'add-pitiquer-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
})
export class DialogAddPitiquer {
  url: string = 'https://eu.ui-avatars.com/api/?name=P+T+Q&size=250';

  constructor(
    public dialogRef: MatDialogRef<DialogAddPitiquer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onNoClick(): void {
    if (this.data && this.data.clearInputs) {
      this.data.clearInputs();
    }
    this.dialogRef.close();
  }

  onSelect(event: any) {
    let fileType = event.target.files[0].type;
    const selectedFile = event.target.files[0];
    this.data.image = selectedFile;

    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };


    } else {
      window.alert('Please select correct image format');
    }
  }

}

@Component({
  selector: 'view-pitiquer-dialog',
  templateUrl: 'view-pitiquer-dialog.html',
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule,MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
})
export class DialogViewPitiquer {
  allowEdit:boolean = false
  serverAPI:string = environment.serverAPI
  constructor(
    public dialogRef: MatDialogRef<DialogViewPitiquer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }


}

@Component({
  selector: 'terminate-pitiquer-dialog',
  templateUrl: 'terminate-pitiquer-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
})
export class DialogTerminatePitiquer {
  constructor(
    public dialogRef: MatDialogRef<DialogTerminatePitiquer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
