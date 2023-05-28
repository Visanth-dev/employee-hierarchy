import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HierarchyService } from 'src/app/services/hierarchy.service';

import { Employee } from 'src/app/entities/employee';

import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { Router } from '@angular/router';

export interface Message {
  message: string;
}
export interface Error {
  error: string;
}

@Component({
  selector: 'app-form-update',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormUpdateComponent implements OnInit {
  myForm = new FormGroup({
    name: new FormControl(''),
    age: new FormControl(0),
    address: new FormControl(''),
    superior_id: new FormControl(),
  });
  public mode = '';
  public employee: Employee | null = {} as Employee;
  public employees: Employee[] | null = [] as Employee[];
  public response: Message | Error | null = null;

  constructor(
    private route: ActivatedRoute,
    private hierarchyService: HierarchyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const url = this.router.url;

    if (url.includes('update')) {
      this.mode = 'update';
      this.employee = {
        id: Number(routeParams.get('id')),
        name: String(routeParams.get('name')),
        age: Number(routeParams.get('age')),
        address: String(routeParams.get('address')),
        superior_id: Number(routeParams.get('superior_id')),
      };
    } else {
      this.mode = 'add';
    }

    if (this.employee && this.isEmployee(this.employee)) {
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
      .subscribe((superior) => {
        if (superior && isNaN(superior)) {
          this.searchMatchingSuperior(superior);
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

    if (
      this.myForm.controls.name.value === '' ||
      this.myForm.controls.age.value === null ||
      this.myForm.controls.address.value === '' ||
      this.myForm.controls.superior_id.value === ''
    ) {
      this.response = { error: 'Please fill all the fields' };
      console.log(this.response);
    } else {
      if (this.employee) {
        this.employee.name = String(this.myForm.controls.name.value);
        this.employee.age = Number(this.myForm.controls.age.value);
        this.employee.address = String(this.myForm.controls.address.value);
        this.employee.superior_id = Number(
          this.myForm.controls.superior_id.value
        );
      }
    }

    if (this.mode === 'update') {
      if (this.employee && Object.keys(this.employee).length > 0) {
        this.hierarchyService.updateEmployee(this.employee);
      }
    } else if (this.mode === 'add') {
      if (this.employee && Object.keys(this.employee).length > 0) {
        this.hierarchyService.addEmployee(this.employee);
      }
    }
  }
}
