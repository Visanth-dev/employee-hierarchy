import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { FormUpdateRoutingModule } from './forms-routing.module';
import { FormUpdateComponent } from './forms.component';

import { NavbarModule } from 'src/app/shared/components/navbar/navbar.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [FormUpdateComponent],
  imports: [
    CommonModule,
    FormUpdateRoutingModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDialogModule,
  ],
})
export class FormUpdateModule {}
