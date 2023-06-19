import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'add',
    loadChildren: () =>
      import('./pages/forms/forms.module').then(
        (m) => m.FormModule
      ),
  },
  {
    path: 'update/:id',
    loadChildren: () =>
      import('./pages/forms/forms.module').then(
        (m) => m.FormModule
      ),
  },
  {
    path: 'delete',
    loadChildren: () =>
      import('./pages/delete/delete.module').then((m) => m.DeleteModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
