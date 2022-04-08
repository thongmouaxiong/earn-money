import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'income',
        loadChildren: () => import('../incomes/incomes.module').then(m => m.IncomesPageModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('../expenses/expenses.module').then(m => m.ExpensesPageModule)
      },
      {
        path: 'earn',
        loadChildren: () => import('../earn/earn.module').then(m => m.EarnPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
