import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FormsComponent } from './components/forms/forms.component';
import { BehaviorSubject } from 'rxjs';
import { CardListComponent } from "./components/card-list/card-list.component";
import { CommonModule } from '@angular/common';
import { Location } from './types/location.interface';
import { GetUnitsService } from './services/get-units.service';
import { LegendsComponent } from './components/legends/legends.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
      RouterOutlet, 
      HeaderComponent, 
      FormsComponent, 
      CardListComponent, 
      FooterComponent, 
      LegendsComponent,
      CommonModule
    ]
})
export class AppComponent {

  showList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  unitsList: Location[] = [];

  constructor(private unitService: GetUnitsService){}
  onSubmit(){
    this.unitsList = this.unitService.getFilteredUnits();
    this.showList.next(true);
  }
}
