import { Component,OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.css']
})
export class BookingManagementComponent implements OnInit{
  constructor(
    private session:SessionService
  ){

  }

  async ngOnInit() {
      await this.session.checkSession()
  }
  pageTitle:string = 'booking'
}
