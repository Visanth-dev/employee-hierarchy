import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import { debounceTime } from 'rxjs';

import { Employee } from 'src/app/entities/employees';

import { HierarchyService } from 'src/app/services/hierarchy.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public employee: Employee | null = {} as Employee;
  public employees: Employee[] | null = [] as Employee[];
  public commandChain: Employee[] | null = [] as Employee[];
  public subordinates: Employee[] | null = [] as Employee[];

  nameControl = new FormControl();

  constructor(private hierarchyService: HierarchyService) {}

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(debounceTime(500)).subscribe((name) => {
      this.getMatchingEmployees(name);
    });
    this.hierarchyService.employees.subscribe((employees) => {
      this.employees = employees;
    });
    this.hierarchyService.employee.subscribe((employee) => {
      this.employee = employee;
    });
    this.hierarchyService.commandChain.subscribe((commandChain) => {
      this.commandChain = commandChain;
    });
    this.hierarchyService.subordinates.subscribe((subordinates) => {
      this.subordinates = subordinates;
    });
  }

  getMatchingEmployees(name: string): void {
    this.hierarchyService.getMatchingEmployees(name);
  }

  getEmployee(employee: Employee) {
    this.commandChain = null;
    this.subordinates = null;
    this.hierarchyService.getEmployee(employee.id);
    console.log(this.employee);
  }

  getHierarchy() {
    if (this.employee) {
      console.log(this.employee.id);
      this.hierarchyService.getHierarchy(this.employee);
    }
  }
}
