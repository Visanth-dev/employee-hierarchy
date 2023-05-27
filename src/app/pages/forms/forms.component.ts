import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HierarchyService } from 'src/app/services/hierarchy.service';

import { Employee } from 'src/app/entities/employee';

import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

export interface Message {
  error: string;
  message: string;
}

@Component({
  selector: 'app-form-update',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormUpdateComponent implements OnInit {
  public employee: Employee | null = {} as Employee;
  myForm = new FormGroup({
    name: new FormControl(),
    age: new FormControl(),
    address: new FormControl(),
    superior_id: new FormControl(),
  });
  public employees: Employee[] | null = [] as Employee[];
  public message: string | null = null;
  public isMessage = false;

  public nameControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private hierarchyService: HierarchyService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.employee = {
      id: Number(routeParams.get('id')),
      name: String(routeParams.get('name')),
      age: Number(routeParams.get('age')),
      address: String(routeParams.get('address')),
      superior_id: Number(routeParams.get('superior_id')),
    };

    if (this.isEmployee(this.employee)) {
      this.myForm.patchValue({
        name: this.employee.name,
        age: this.employee.age,
        address: this.employee.address,
        superior_id: this.employee.superior_id,
      });
    }

    this.hierarchyService.employees.subscribe((emps) => {
      this.employees = emps;
    });
    this.myForm.controls.superior_id.valueChanges
      .pipe(debounceTime(500))
      .subscribe((name) => {
        if (name && isNaN(name)) {
          this.searchMatchingSuperior(name);
        }
      });
  }

  isEmployee(employee: Employee) {
    if (employee.name) {
      if (employee.age) {
        if (employee.address) {
          return true;
        }
      }
    }
    return false;
  }

  searchMatchingSuperior(name: string) {
    this.hierarchyService.getMatchingEmployees(name);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.myForm.value);

    // this.employee?.name = this.myForm.controls.name
    // if (this.myForm.controls.name === null) {
    //   this.message = "Enter employee's name";
    //   this.isMessage = true;
    // }
    if (this.employee && Object.keys(this.employee).length > 0) {
      this.hierarchyService.updateEmployee(this.employee);
      if (this.isMessage) {
        this.isMessage = true;
      }
    }
  }

  switchMessage() {
    this.isMessage = false;
  }
}
