import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { Location } from '../../types/location.interface';
import { FilterUnitsService } from '../../services/filter-units.service';


@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit {
  results: Location[] = [];
  filteredResults: Location[] = [];
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private unitService: GetUnitsService, 
    private filterUnitsService: FilterUnitsService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true
    });
    this.unitService.getAllUnits().subscribe(data => {
      this.results = data.locations as unknown as Location[];
      this.results = this.results.filter(location => location.schedules !== undefined);
      
      this.filteredResults = data.locations as unknown as Location[];
      this.filteredResults = this.filteredResults.filter(location => location.schedules !== undefined);
    });
  }

  

  onSubmit(): void {
    let {showClosed, hour} = this.formGroup.value
    this.filteredResults = this.filterUnitsService.filter(this.results, showClosed, hour)
  }

  clear(): void {
    this.formGroup.reset();
  }
}
