import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarModule } from './car/car.module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {
  editCar(id_car: number) {
    throw new Error('Method not implemented.');
  }

  // url principal 
  url:string = "http://127.0.0.1:5000";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }


  saveCare(car:CarModule){

    console.log(this.url+"/savecar");

    console.log("car service" + car);

    return this.http.post(this.url+"/savecar" , car , this.httpOptions );
  }


  getAllcars():Observable<CarModule[]>{

     return  this.http.get<CarModule[]>(this.url+"/cars" ,this.httpOptions );
  }

  getCar(id:number):Observable<CarModule>{
    return this.http.get<CarModule>(this.url+"/car/"+id , this.httpOptions );
  }
  deleteCar(carId: number) {
    const url =`${this.url}/deletecar/${carId}`;
    return this.http.delete(url, this.httpOptions);
  }
  updateCar(car:CarModule):Observable<CarModule>{
    return this.http.put<CarModule>(this.url+"/updatecar" , car , this.httpOptions );
  }
    


}
