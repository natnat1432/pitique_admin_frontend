import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environement/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private locstorage: LocalstorageService,
    private http: HttpClient,
    private router: Router,
  ) { }


  saveSession(data: any) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key !== 'success') {
          this.locstorage.saveData(key, data[key])
        }
      }
    }
  }

  async checkSession() {
    const accessToken = await this.locstorage.getData("accessToken")
    const formData = {
      'accessToken': accessToken,
    }

    this.http.post(`${environment.serverAPI}/api/auth/token/validate`, formData).subscribe(
      (response: any) => {
        if (response.valid === true) {
        }
        else {
          this.refreshToken()
        }
      },
      (error: any) => {
        if (error.error.valid === false) {
          this.refreshToken()
        }
        else {
          console.warn('Error checking session', error)
        }
      },
    )
  }
  async checkSessionLogin() {
    const accessToken = await this.locstorage.getData("accessToken")
    const formData = {
      'accessToken': accessToken,
    }

    this.http.post(`${environment.serverAPI}/api/auth/token/validate`, formData).subscribe(
      (response: any) => {
        if (response.valid === true) {
          this.router.navigate(['dashboard'])
        }
        else {
      
        }
      },
      (error: any) => {
        if (error.error.valid === false) {
        }
        else {
          console.warn('Error checking session', error)
        }
      },
    )
  }
  async refreshToken() {
    const refreshToken = await this.locstorage.getData('refreshToken')
    const formData = {
      'token': refreshToken
    }
    this.http.post(`${environment.serverAPI}/api/auth/token`, formData).subscribe(
      (response: any) => {
        if (response.valid === true && response.success === true) {
          this.locstorage.saveData('accessToken', response.accessToken)
        }
      },
      (error) => {
        if (error.error.valid === false || error.error.success === false) {
          this.locstorage.clearData()
          this.router.navigate(['/'])
        }

        console.warn('Error refreshing token', error)
      }
    )
  }

  async logout() {
    const refreshToken: any = await this.locstorage.getData('refreshToken')
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': refreshToken,
      })
    }
    this.http.delete(`${environment.serverAPI}/api/auth/logout`, options).subscribe(
      (response: any) => {
        this.locstorage.clearData()
        this.router.navigate(['/'])
      },
      (error) => {
        console.warn(error)
      }
    )
  }
}
