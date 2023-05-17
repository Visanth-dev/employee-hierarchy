import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  employees!: Observable<
    {
      address: string;
      age: number;
      id: number;
      name: string;
      superior_id: number | null;
    }[]
  >;

  constructor(private http: HttpClient) {}

  ngOnInit(): void{
    this.employees = this.http.get<
      {
        address: string;
        age: number;
        id: number;
        name: string;
        superior_id: number | null;
      }[]
    >('http://localhost:5000/');
  }
}
