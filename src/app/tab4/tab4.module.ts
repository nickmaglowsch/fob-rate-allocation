import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';
import { HotTableModule } from '@handsontable/angular';
import { DataTableModule } from "angular-6-datatable";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HotTableModule,
    DataTableModule,
    RouterModule.forChild([{ path: '', component: Tab4Page }])
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
