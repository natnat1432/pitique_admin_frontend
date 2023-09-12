import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css']
})
export class PaymentManagementComponent implements OnInit{
  constructor(
    private session:SessionService
  ){

  }
  async ngOnInit() {
      await this.session.checkSession()
  }
  pageTitle:string = 'payment'
}
