import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

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
export class HomeComponent {
  name = '';
  employee: any;
  employees!: Observable<Employee[]> | null;
  commandChain!: Observable<Employee[]> | null;
  subordinates!: Observable<Employee[]> | null;

  constructor(private http: HttpClient) {}

  getMatchingEmployees() {
    this.employees = this.http.get<{ id: number; name: string }[]>(
      `http://localhost:5000/search/${this.name}`
    );
  }

  setEmployee(emp: Object) {
    console.log(emp);
    this.employee = emp;
  }

  getHierarchy() {
    this.getCommandChain();
    this.getSubordinates();
  }

  getCommandChain() {
    this.commandChain = this.http.get<Employee[]>(
      `http://localhost:5000/commandChain/${this.employee.id}`
    );
  }

  getSubordinates() {
    this.subordinates = this.http.get<Employee[]>(
      `http://localhost:5000/subordinates/${this.employee.id}`
    );
  }
}
