import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab5Page } from './tab5.page';
import { HotTableModule } from '@handsontable/angular';
import { DataTableModule } from "angular-6-datatable";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HotTableModule,
    DataTableModule,
    RouterModule.forChild([{ path: '', component: Tab5Page }])
  ],
  declarations: [Tab5Page]
})
export class Tab5PageModule {}
