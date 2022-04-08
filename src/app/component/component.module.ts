import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopIncomeComponent } from './pop-income/pop-income.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PopIncomeComponent],
  exports: [PopIncomeComponent],
  imports: [CommonModule,FormsModule, IonicModule, RouterModule],
})

export class ComponentModule {}
