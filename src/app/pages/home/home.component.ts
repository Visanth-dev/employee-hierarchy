import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { debounceTime } from 'rxjs';

import { Employee } from 'src/app/interfaces/employee';
import { HierarchyService } from 'src/app/services/hierarchy/hierarchy.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public employee: Employee | null = {} as Employee;
  public isEmployee = false;
  public employee_id: number | null = null;

  public employees: Employee[] | null = [] as Employee[];

  public commandChain: Employee[] | null = [] as Employee[];
  public isCommandChain = false;

  public subordinates: Employee[] | null = [] as Employee[];
  public isSubordinates = false;

  private response: string | null = null;

  private SERVER_ERROR =
    "Sorry, we're having trouble connecting. Check your internet connection and try again. If the problem persists, contact customer support.";

  // Form control for name input
  public nameControl = new FormControl();

  constructor(
    private hierarchyService: HierarchyService,
    private dialog: MatDialog
  ) {}

  //
  ngOnInit(): void {
    // Subscribe to name control value changes with debounce time of 500ms
    this.nameControl.valueChanges.pipe(debounceTime(500)).subscribe((name) => {
      // If name is not null and contains only alphabets, call getMatchingEmployees with name as argument
      if (name && this.isAlpha(name)) {
        this.getMatchingEmployees(name);
      }
    });
  }

  //
  // Call getMatchingEmployees from hierarchy service with name as argument
  private async getMatchingEmployees(name: string): Promise<void> {
    try {
      await this.hierarchyService
        .getMatchingEmployees<Employee[]>(name)
        .then((res) => (this.employees = res as Employee[]));
    } catch (error) {
      this.response = error ? (error as string) : this.SERVER_ERROR;
      this.openResponseDialog();
    }
  }

  //
  // If a value in the name input and employee_id is present
  // Get employee and their hierarchy data
  public async getEmployeeHierarchy() {
    if (this.nameControl.value && this.employee_id) {
      try {
        this.hideEmployeeData();

        await this.getEmployee(this.employee_id);
        await this.getCommandChain(this.employee_id);
        await this.getSubordinates(this.employee_id);

        this.showEmployeeData();
      } catch (error) {
        this.response = error ? (error as string) : this.SERVER_ERROR;
        this.openResponseDialog();
      }
    }
  }

  //
  // Calls for employee data using the local employee_id
  // Response assigned to local employee
  private async getEmployee(employee_id: number) {
    await this.hierarchyService
      .getEmployee<Employee>(employee_id)
      .then((res) => (this.employee = res));
  }

  //
  // Requests command chain of employee using local employee_id
  // Response assigned to local commandChain
  private async getCommandChain(employee_id: number) {
    await this.hierarchyService
      .getCommandChain<Employee[]>(employee_id)
      .then((res) => (this.commandChain = res));
  }

  //
  // Requests subordinates of employee using local employee_id
  // Response assigned to local subordinates
  private async getSubordinates(employee_id: number) {
    await this.hierarchyService
      .getSubordinates<Employee[]>(employee_id)
      .then((res) => (this.subordinates = res));
  }

  //
  // Delete employee that shares the local employee_id
  private async deleteEmployee(employee_id: number) {
    try {
      const res = await this.hierarchyService.deleteEmployee(employee_id);
      if (res) {
        this.response = res as string;
      }
    } catch (error) {
      this.response = error ? (error as string) : this.SERVER_ERROR;
    }
    this.openResponseDialog();
  }

  //
  // Check if string contains only alphabets using regex
  private isAlpha(name: string) {
    return /^[a-zA-Z]+$/.test(name);
  }

  //
  // Response message is displayed using this dialog box
  private openResponseDialog() {
    this.dialog.open(DialogComponent, { width: '500px', data: this.response });
  }

  //
  // Confirmation dialog box to confirm deleting an employee
  public openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.confirm.subscribe(() => {
      if (this.employee) this.deleteEmployee(this.employee.id);
      this.clearStoredData();
    });
  }

  //
  // Hide employee hierarchy data
  private hideEmployeeData() {
    this.isEmployee = false;
    this.isCommandChain = false;
    this.isSubordinates = false;
  }

  //
  // Unhide employee hierarchy data
  private showEmployeeData() {
    this.isEmployee = true;
    this.isCommandChain = true;
    this.isSubordinates = true;
  }

  //
  // Removes all stored data and hides the employee, commandChain and subordinates components
  private clearStoredData() {
    this.employee_id = null;
    this.employee = null;
    this.isEmployee = false;
    this.commandChain = null;
    this.isCommandChain = false;
    this.subordinates = null;
    this.isSubordinates = false;
    this.employees = null;
  }
}
