import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { debounceTime } from 'rxjs';

import { HierarchyService } from 'src/app/services/hierarchy/hierarchy.service';
import { Employee } from 'src/app/interfaces/employee';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-form-update',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormComponent implements OnInit {
  // Form group for employee data
  public myForm = this.formBuilder.group({
    name: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(18)]],
    address: ['', Validators.required],
    superior_id: [''],
  });

  private isUpdate = true;

  private employee: Employee | null = {} as Employee;
  private isEmployee = false;

  public employees: Employee[] | null = [] as Employee[];

  private response: string | null = '';

  private SERVER_ERROR =
    "Sorry, we're having trouble connecting. Check your internet connection and try again. If the problem persists, contact customer support.";

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private hierarchyService: HierarchyService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  //
  ngOnInit(): void {
    // Get route parameters and current URL
    const routeParams = this.route.snapshot.paramMap;
    const url = this.router.url;

    // Check if URL includes 'update' to determine if updating or adding employee
    // If 'update' then fetch employee details using id from route
    if (url.includes('update')) {
      this.isUpdate = true;

      const employee_id = Number(routeParams.get('id'));

      this.setEmployee(employee_id);
    } else {
      this.isUpdate = false;
    }

    // Subscribe to changes in superior_id form control value
    this.myForm.controls.superior_id.valueChanges
      .pipe(debounceTime(500))
      .subscribe((superior) => {
        // If superior value exists and is alphabetical, search for matching superior
        if (superior && this.isAlpha(superior)) {
          this.searchMatchingSuperior(superior);
        }
      });
  }

  private openResponseDialog() {
    this.dialog.open(DialogComponent, { width: '500px', data: this.response });
  }

  private async setEmployee(employee_id: number) {
    try {
      await this.hierarchyService
        .getEmployee<Employee>(employee_id)
        .then((emp) => {
          this.employee = emp as Employee;
        });
      this.isEmployee = true;
      this.setFormValues();
    } catch (error) {
      error
        ? (this.response = error as string)
        : (this.response = this.SERVER_ERROR);
      this.openResponseDialog();
    }
  }

  private setFormValues() {
    // If employee data exists and is valid, set form values
    if (this.isUpdate && this.isEmployee && this.employee) {
      this.myForm.setValue({
        name: this.employee.name,
        age: this.employee.age,
        address: this.employee.address,
        superior_id: String(this.employee.superior_id),
      });
    }
  }

  //
  // Check if string contains only alphabetical characters
  private isAlpha(superior: string) {
    return /^[a-zA-Z]+$/.test(superior);
  }

  //
  // Search for matching superior using hierarchy service
  private async searchMatchingSuperior(name: string) {
    try {
      await this.hierarchyService
        .getMatchingEmployees<Employee[]>(name)
        .then((value) => (this.employees = value as Employee[]));
    } catch (error) {
      this.response = error ? (error as string) : this.SERVER_ERROR;
      this.openResponseDialog();
    }
  }

  //
  // Handle form submission
  public async onSubmit(event: Event) {
    event.preventDefault();

    // If form is valid, update employee data from form values
    if (this.myForm.valid) {
      this.updateEmployeeFromForm();
      await this.updateOrAddEmployee();
    } else {
      // If form is invalid, set response error message
      this.response = 'Please fill all the fields';
      this.openResponseDialog();
    }
  }

  //
  // Update employee data from form values
  private updateEmployeeFromForm() {
    if (this.employee) {
      this.employee.name = String(this.myForm.controls.name.value);
      this.employee.age = Number(this.myForm.controls.age.value);
      this.employee.address = String(this.myForm.controls.address.value);
      this.employee.superior_id = Number(
        this.myForm.controls.superior_id.value
      );
    }
    this.isEmployee = true;
  }

  //
  // Update or add employee using hierarchy service based on isUpdate value
  private async updateOrAddEmployee() {
    if (this.employee && this.isEmployee) {
      try {
        if (this.isUpdate) {
          this.response = await this.hierarchyService.updateEmployee(
            this.employee
          );
        } else {
          this.response = await this.hierarchyService.addEmployee(
            this.employee
          );
        }
      } catch (error) {
        this.response = error ? (error as string) : this.SERVER_ERROR;
      }
      this.openResponseDialog();
    }
  }
}
