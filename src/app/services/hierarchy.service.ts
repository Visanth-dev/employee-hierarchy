import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Employee } from '../entities/employees';

import { BehaviorSubject } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getMatchingEmployees(name: string) {
    this.http
      .get<Employee[]>(`http://localhost:5000/search/${name}`)
      .subscribe((emp) => {
        this.employees.next(emp);
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
}
