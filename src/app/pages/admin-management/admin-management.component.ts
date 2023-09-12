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


@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})

export class AdminManagementComponent implements OnInit {
  pageTitle: string = 'admin'
  isLoading: boolean = false
  displayedColumns: string[] = ['image', 'id', 'name', 'email', 'phone', 'actions'];

  dataSource: any
  admins: any
  serverAPI: string = environment.serverAPI
  add_admin_data = {
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    phone: '',
    image: null,
    super: false,
    status: ''
  }

  constructor(
    public dialog: MatDialog,
    private session: SessionService,
    private localstorage: LocalstorageService,
    private http: HttpClient,
    private util: UtilService
  ) {

  }

  async ngOnInit() {
    await this.session.checkSession()
    await this.getAdmins()
  }

  public clearInputs() {
    this.add_admin_data.firstname = ''
    this.add_admin_data.middlename = ''
    this.add_admin_data.lastname = ''
    this.add_admin_data.email = ''
    this.add_admin_data.phone = ''
    this.add_admin_data.image = null
    this.add_admin_data.super = false
    this.add_admin_data.status = ''
  }

  addAdmin(): void {
    const dialogRef = this.dialog.open(DialogAddAdmin, {
      data: {
        adminData: this.add_admin_data,
        clearInputs: this.clearInputs.bind(this)
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result != null) {
        this.registerAdmin(result)
      }
    });
  }
  viewAdmin(data:[]) {
    const viewdialogRef = this.dialog.open(DialogViewAdmin, {
      data: data
    });
    viewdialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updateAdmin(result)
      }
    });
  }


  async registerAdmin(result: any) {
    this.isLoading = true
    if (result.email != null && result.firstname != null
      && result.lastname != null && result.phone != null &&
      result.status != null) {
      const accessToken = await this.localstorage.getData('accessToken')

      const options = {
        headers: {
          'authorization': `Bearer ${accessToken}`
        }
      }

      const formData = new FormData()
      if (result.phone.length != 10 && result.phone.charAt(0) != '9' && result.phone != '') {

      }
      else {

      }
      formData.append('email', result.email)
      formData.append('firstname', result.firstname)
      formData.append('middlename', result.middlename)
      formData.append('lastname', result.lastname)
      if (result.phone != '') formData.append('phone', "+63" + result.phone)
      formData.append('status', result.status)
      formData.append('superadmin', result.super)
      formData.append('image', result.image)


      const response = this.http.post(`${environment.serverAPI}/api/admin/`, formData, options).toPromise()
      const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))
      return await Promise.all([response, loadingPromise]).then(
        (response: any) => {
          this.isLoading = false

          if (response[0].success == true) {
            this.util.openSnackBar("Admin added successfully", "OK")
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
    else {
      this.isLoading = false
      this.util.openSnackBar("Please fill all the fields completely", "OK")
    }

  }

  async getAdmins() {
    this.isLoading = true
    const accessToken = await this.localstorage.getData('accessToken')

    const options = {
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    }
    const response = this.http.get(`${environment.serverAPI}/api/admin/`, options).toPromise()
    const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))
    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false
        this.dataSource = response.data
      },
      (error: any) => {
        this.isLoading = false
        console.error("Error fetching admins", error)
        this.util.openSnackBar(error.error.message, "OK")
      }
    )
  }

  async updateAdmin(data:any){
      this.isLoading = true
      const accessToken = await this.localstorage.getData('accessToken')
      const options = {
        headers:{
          'authorization':`Bearer ${accessToken}`
        }
      }
      let formData = {
        email:data.admin_email,
        firstname:data.admin_fname,
        middlename:data.admin_mname,
        lastname:data.admin_lname,
        id:data.admin_id,
        issuper:data.admin_issuper,
        status:data.admin_status,
        phone:data.admin_phone,
      }

      const response  = this.http.patch(`${environment.serverAPI}/api/admin/`, formData, options).toPromise()
      const loadingPromise = new Promise(resolve => setTimeout(resolve, environment.loadingtime))

      return await Promise.all([response,loadingPromise]).then(
        ([response]:any) => {
          this.isLoading = false
          this.getAdmins()
          this.util.openSnackBar(response.message, "OK")

        },
        (error:any) => {
          this.isLoading = false
          console.error("Error updating admin", error)
          this.util.openSnackBar(error.error.message, "OK")
        }
      )
  
  }


}


@Component({
  selector: 'add-admin-dialog',
  templateUrl: 'add-admin-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
})
export class DialogAddAdmin {
  url: string = 'https://eu.ui-avatars.com/api/?name=P+T+Q&size=250';

  constructor(
    public dialogRef: MatDialogRef<DialogAddAdmin>,
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
  selector: 'view-admin-dialog',
  templateUrl: 'view-admin-dialog.html',
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule,MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
})
export class DialogViewAdmin {
  allowEdit:boolean = false
  serverAPI:string = environment.serverAPI
  constructor(
    public dialogRef: MatDialogRef<DialogViewAdmin>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
