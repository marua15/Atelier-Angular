import { Component, OnInit } from '@angular/core';
import { CarModule } from '../car/car.module';
import { ActivatedRoute } from '@angular/router';
import { CarServiceService } from '../car-service.service';

@Component({
  selector: 'app-editcar',
  templateUrl: './editcar.component.html',
  styleUrls: ['./editcar.component.css']
})
export class EditcarComponent implements OnInit {
  cars! : CarModule[];
  id_car! : number;
  model! : string;
  hp! : number;
  marque! : string;

  constructor(private rooute: ActivatedRoute, private theservice: CarServiceService){}

  ngOnInit() {
      this.rooute.params.subscribe(params => {
        this.id_car = +params['id_car'];
      });

      this.theservice.getAllcars().subscribe(data => {
        this.cars = data;
      })
  }

  editCar() {
    let car = new CarModule();
    car.id_car = this.id_car;
    car.model = this.model;
    car.hp = this.hp;
    car.marque = this.marque;
    this.theservice.updateCar(car).subscribe();
  }
}
