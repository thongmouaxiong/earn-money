import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomesPageRoutingModule } from './incomes-routing.module';

import { IncomesPage } from './incomes.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomesPageRoutingModule,
    ComponentModule
  ],
  declarations: [IncomesPage]
})
export class IncomesPageModule {}
