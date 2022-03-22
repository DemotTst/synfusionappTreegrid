import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { PageService, FilterService, EditService, ColumnChooserService, ToolbarService } from '@syncfusion/ej2-angular-treegrid';
import { SortService, ResizeService, ExcelExportService, PdfExportService, ContextMenuService } from '@syncfusion/ej2-angular-treegrid';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TreegridComponent } from './treegrid/treegrid.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    TreegridComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TreeGridModule,
    ContextMenuModule,
    DropDownListModule,
    ButtonModule,
    DialogModule,
    HttpClientModule,
    FormsModule,
    DialogModule,


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PageService,
    SortService,
    FilterService,
    EditService,
    SortService, ResizeService,
    ExcelExportService,
    PdfExportService, ContextMenuService,
    ToolbarService, ColumnChooserService],
  bootstrap: [AppComponent]

})
export class AppModule { }
