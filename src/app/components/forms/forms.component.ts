import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() submitEvent = new EventEmitter();

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
      this.results = data;
      this.results = this.results.filter(locations => locations.schedules !== undefined);
      
      this.filteredResults = data;
      this.filteredResults = this.filteredResults.filter(locations => locations.schedules !== undefined);
    });
  }

  onSubmit(): void {
    let {showClosed, hour} = this.formGroup.value;
    this.filteredResults = this.filterUnitsService.filter(this.results, showClosed, hour);
    this.unitService.setFilteredUnits(this.filteredResults);

    this.submitEvent.emit();
  }

  clear(): void {
    this.formGroup.reset();
  }
}
