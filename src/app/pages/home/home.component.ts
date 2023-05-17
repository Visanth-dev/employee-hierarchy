import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  options = [{ name: 'naruto', id: 5 }];
  name = '';
  employee : any;
  employees!: Observable<
    {
      id: number;
      name: string;
    }[]
  > | null;
  commandChain!: Observable<
    {
      id: number;
      name: string;
      superior_id: number | null;
    }[]
  > | null;
  
  subordinates!: Observable<
    {
      id: number;
      name: string;
      superior_id: number | null;
    }[]
  > | null;

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
    this.getCommandChain()
    this.getSubordinates()
  }

  getCommandChain() {
    this.commandChain = this.http.get<
      {
        id: number;
        name: string;
        superior_id: number | null;
      }[]
    >(`http://localhost:5000/commandChain/${this.employee.id}`)
  }

  getSubordinates() {
    this.subordinates = this.http.get<
      {
        id: number;
        name: string;
        superior_id: number | null;
      }[]
    >(`http://localhost:5000/subordinates/${this.employee.id}`)
  }
}
