import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Employee } from '../entities/employee';

import { BehaviorSubject } from 'rxjs';

export interface Message {
  message: string;
}
export interface Error {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class HierarchyService {
  public employee = new BehaviorSubject<Employee | null>({} as Employee);
  public employees = new BehaviorSubject<Employee[] | null>([] as Employee[]);
  public commandChain = new BehaviorSubject<Employee[] | null>(
    [] as Employee[]
  );
  public subordinates = new BehaviorSubject<Employee[] | null>(
    [] as Employee[]
  );
  public message = new BehaviorSubject<Message | Error | null>(null);

  constructor(private http: HttpClient) {}

  getMatchingEmployees(name: string) {
    this.http
      .get<Employee[]>(`http://localhost:5000/search/${name}`)
      .subscribe((emps) => {
        this.employees.next(emps);
      });
  }

  getEmployee(id: number) {
    this.http
      .get<Employee>(`http://localhost:5000/getEmployee/${id}`)
      .subscribe((employee) => {
        this.employee.next(employee);
      });
  }

  getHierarchy(employee: Employee) {
    this.http
      .get<Employee[]>(`http://localhost:5000/commandChain/${employee.id}`)
      .subscribe((commandChain) => {
        this.commandChain.next(commandChain);
      });
    this.http
      .get<Employee[]>(`http://localhost:5000/subordinates/${employee.id}`)
      .subscribe((subordinates) => {
        this.subordinates.next(subordinates);
      });
  }

  updateEmployee(employee: Employee) {
    this.http
      .post<Message | Error>(`http://localhost:5000/update`, employee)
      .subscribe((response) => {
        this.message.next(response);
        console.log(this.message.value);
      });
  }

  addEmployee(employee: Employee) {
    this.http
      .post<Message | Error>(`http://localhost:5000/add`, employee)
      .subscribe((response) => {
        this.message.next(response);
        console.log(this.message.value);
      });
  }
}
