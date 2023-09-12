import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { environment } from '../environement/environment';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private _snackBar:MatSnackBar
  ) { }

  openSnackBar(message:string,action:string){
    this._snackBar.open(message,action);
  }
}
