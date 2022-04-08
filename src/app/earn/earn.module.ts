import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EarnPageRoutingModule } from './earn-routing.module';

import { EarnPage } from './earn.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EarnPageRoutingModule,
    ComponentModule
  ],
  declarations: [EarnPage]
})
export class EarnPageModule {}
