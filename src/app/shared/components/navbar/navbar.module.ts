import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar.component';

import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterLink } from '@angular/router';


@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterLink,
  ],
  exports: [NavbarComponent]
})
export class NavbarModule { }
