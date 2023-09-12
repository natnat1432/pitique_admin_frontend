import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { environment } from 'src/app/environement/environment';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  email:string = ''
  pass:string = ''
  isLoading:boolean = false
  hide:boolean = true
  testdata:any

  constructor(
    private _util:UtilService,
    private http:HttpClient,
    private localstorage:LocalstorageService,
    private session:SessionService,
    private router:Router,
  ){

  }
  async ngOnInit(){
      await this.session.checkSessionLogin()

    }

  async login(){
    if(this.email!== '' && this.pass!== '' ){
      this.isLoading = true;
      const formData = {
        email:this.email,
        password:this.pass,
        user_type:'admin'
      } 
      try{
        const response = this.http.post(`${environment.serverAPI}/api/auth/login`,formData).toPromise()
        const loadingPromise = new Promise(resolve => setTimeout(resolve,environment.loadingtime))

        return await Promise.all([response,loadingPromise]).then(
          ([response]) => {
            this.session.saveSession(response)
            this.isLoading = false
            this.router.navigate(['dashboard'])
          }
        ).catch(error => {
          console.error('Error loggingg in', error)
          this.isLoading = false
          this._util.openSnackBar(error.error.message, 'OK')
        })

      }catch(error){
        console.error(error)
        this.isLoading = false
        this._util.openSnackBar('Error logging in', 'OK')
      }

    
    }
    else{
       this._util.openSnackBar('Please fill all the fields', 'OK')
    }
  }


}
