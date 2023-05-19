import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarModule } from './car/car.module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {
  private readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + localStorage.getItem('jwt'));
  getCarById(id_car: any) {
    console.log(this.url + '/car/' + id_car);
    return this.http.get(this.url + '/car/' + id_car, {headers:this.headers});
 }
  // url principal 
  url:string = "http://127.0.0.1:5000";


  constructor(private http:HttpClient) { }


  saveCare(car:CarModule){

    console.log(this.url+"/savecar");

    console.log("car service" + car);

    return this.http.post(this.url+"/savecar" , car ,  {headers:this.headers} );

  }
  deleteCar(carId: number) {
    const url = `${this.url}/deletecar/${carId}`;
    return this.http.delete(url,  {headers:this.headers});
  }
  getAllcars():Observable<CarModule[]>{

     return  this.http.get<CarModule[]>(this.url+"/cars" , {headers:this.headers} );
  }
  
  editCar(car : CarModule):Observable<CarModule> {
    const url = `${this.url}/editcar/${car.id_car}`;
    return this.http.put<CarModule>(url, car,  {headers:this.headers});
  }
  




}