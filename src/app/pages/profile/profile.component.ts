import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environement/environment';
import { SessionService } from 'src/app/services/session.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { UtilService } from 'src/app/services/util.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    isLoading:boolean = false
    pageTitle:string = "profile"
    serverAPI:string = environment.serverAPI
    allowEdit:boolean = false
    data:any
    isLoaded:boolean = false
    constructor(
      private session:SessionService,
      private storage:LocalstorageService,
      private util:UtilService,
      private http: HttpClient,
    ){

    }

    async ngOnInit() {
      await this.session.checkSession()
      await this.getProfileInfo()
    }

    async getProfileInfo(){
      const accessToken = await this.storage.getData('accessToken')
      const id = await this.storage.getData('id')
      const options = {
        headers: {
          'authorization': `Bearer ${accessToken}`
        }
      }

      this.http.get(`${this.serverAPI}/api/admin/${id}`, options).subscribe(
        (response:any) => {
          console.log(response)
          this.data = response.data
          this.isLoaded = true
        },
        (error) =>{
          console.error(error)
        }
      )
    }

}
