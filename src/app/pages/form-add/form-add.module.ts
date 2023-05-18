import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormAddRoutingModule } from './form-add-routing.module';
import { FormAddComponent } from './form-add.component';


@NgModule({
  declarations: [
    FormAddComponent
  ],
  imports: [
    CommonModule,
    FormAddRoutingModule
  ]
})
export class FormAddModule { }
