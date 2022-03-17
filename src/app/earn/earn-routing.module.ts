import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EarnPage } from './earn.page';

const routes: Routes = [
  {
    path: '',
    component: EarnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EarnPageRoutingModule {}
