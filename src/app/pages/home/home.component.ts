import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { Observable, debounceTime } from 'rxjs';

interface Employee {
  id: number;
  name: string;
  superior_id?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  employee!: Employee
  employees!: Observable<Employee[]>;
  commandChain!: Observable<Employee[]> | null;
  subordinates!: Observable<Employee[]> | null;

  nameControl = new FormControl();

  constructor(private http: HttpClient) {
    
  }

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(debounceTime(500)).subscribe((name) => {
      this.getMatchingEmployees(name);
    });
  }

  getMatchingEmployees(name: string): void {
    console.log(name)
    this.employees = this.http.get<Employee[]>(
      `http://localhost:5000/search/${name}`
    );
  }

  setEmployee(emp: Employee) {
    this.commandChain = null;
    this.subordinates = null;
    this.employee = emp;
  }

  getHierarchy() {
    this.getCommandChain();
    this.getSubordinates();
  }

  getCommandChain() {
    this.commandChain = this.http.get<Employee[]>(
      `http://localhost:5000/commandChain/${this.employee.id}`
    )
  }

  getSubordinates() {
    this.subordinates = this.http.get<Employee[]>(
      `http://localhost:5000/subordinates/${this.employee.id}`
    );
  }
}