import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee } from '../../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class HierarchyService {
  constructor(private http: HttpClient) {}

  public getMatchingEmployees<T>(name: string) {
    return new Promise((resolve, reject) => {
      this.http.get<T>(`http://localhost:5000/search/${name}`).subscribe({
        next: (response) => {
          if (Array.isArray(response)) resolve(response);
          else reject(response);
        },
        error: (error) => {
          reject(error.error.message);
        },
      });
    });
  }

  //
  // Method to get a single employee by ID
  public getEmployee<T>(id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http.get<T>(`http://localhost:5000/get-employee/${id}`).subscribe({
        next: (response) => {
          if (response && Object.keys(response).length > 0) resolve(response);
          else reject(response);
        },
        error: (error) => {
          reject(error.error.message);
        },
      });
    });
  }

  //
  // Method to get the command chain and subordinates of an employee
  public getCommandChain<T>(employee_id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http
        .get<T>(`http://localhost:5000/command-chain/${employee_id}`)
        .subscribe({
          next: (response) => {
            if (Array.isArray(response)) resolve(response);
            else reject(response);
          },
          error: (error) => {
            console.log(error)
            reject(error.error.message);
          },
        });
    });
  }

  public getSubordinates<T>(employee_id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http
        .get<T>(`http://localhost:5000/subordinates/${employee_id}`)
        .subscribe({
          next: (response) => {
            if (Array.isArray(response)) resolve(response);
            else reject(response);
          },
          error: (error) => {
            reject(error.error.message);
          },
        });
    });
  }

  //
  // Method to update an employee
  public updateEmployee<T>(employee: Employee): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http.post<T>(`http://localhost:5000/update`, employee).subscribe({
        next: (response) => {
          if (typeof response === 'string') resolve(response);
          else reject(response);
        },
        error: (error) => {
          reject(error.error.message);
        },
      });
    });
  }

  //
  // Method to add a new employee
  public addEmployee<T>(employee: Employee): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http.post<T>(`http://localhost:5000/add`, employee).subscribe({
        next: (response) => {
          if (typeof response === 'string') resolve(response);
          else reject(response);
        },
        error: (error) => {
          reject(error.error.message);
        },
      });
    });
  }

  public deleteEmployee<T>(employee_id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http
        .delete<T>(`http://localhost:5000/delete/${employee_id}`)
        .subscribe({
          next: (response) => {
            if (typeof response === 'string') resolve(response);
            else reject(response);
          },
          error: (error) => {
            reject(error.error.message);
          },
        });
    });
  }
}
