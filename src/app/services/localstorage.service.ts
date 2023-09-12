import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(
    private storage:StorageMap,
  ) { }

  saveData(name:string,data:any){
    this.storage.set(name,data).subscribe()
  }
   async getData(name:string){
    return await this.storage.get(name).toPromise()
  }
  deleteData(name:string){
    this.storage.delete(name).subscribe()
  }
  clearData(){
    this.storage.clear().subscribe()
  }

}
