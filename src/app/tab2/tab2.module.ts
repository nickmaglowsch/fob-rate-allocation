import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { HotTableModule } from '@handsontable/angular';
import { DataTableModule } from "angular-6-datatable";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HotTableModule,
    DataTableModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule { }
