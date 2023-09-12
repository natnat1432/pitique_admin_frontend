import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  pageTitle:string = 'dashboard'
  isLoading:boolean = false
  constructor(
    private session:SessionService,
  ){

  }
  async ngOnInit() {
     await this.session.checkSession()
  
  }


}
