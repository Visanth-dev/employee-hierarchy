import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { HttpClientModule } from '@angular/common/http';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';

import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    FormsModule,
    MatTabsModule,
    MatInputModule,
  ],
})
export class HomeModule {}
