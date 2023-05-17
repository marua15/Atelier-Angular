import { Component } from '@angular/core';
import { CarServiceService } from '../car-service.service';
import { CarModule } from './car.module';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent {



// two way binding
  model!:string ;

  hp!:number ;

  marque!:string ;
  id_car!: CarModule;


  constructor(private carservice:CarServiceService){


  }


  //event bindding
  
  
  saveMe(){

    console.log("click!!!!1");

    let mycar = new CarModule() ;

    mycar.id_car = 0 ;
    mycar.hp = this.hp ;
    mycar.model = this.model ;
    mycar.marque = this.marque ;

    console.log(mycar);

    this.carservice.saveCare(mycar).subscribe();

  }
  deleteMe(id_car: any){
    console.log("click!!!!2");
    this.carservice.deleteCar(0).subscribe();

  }
  updateMe(id_car: CarModule){
    console.log("click!!!!3");
    this.carservice.updateCar(id_car).subscribe();

  }





}
