import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormAddRoutingModule } from './form-add-routing.module';
import { FormAddComponent } from './form-add.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    FormAddComponent
  ],
  imports: [
    CommonModule,
    FormAddRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class FormAddModule { }
