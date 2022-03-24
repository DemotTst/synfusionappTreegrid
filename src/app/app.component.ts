import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { closest, createElement, EmitType } from '@syncfusion/ej2-base';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { TreeGrid, Selection, ColumnChooser, Reorder, Resize, RowDD } from '@syncfusion/ej2-treegrid';
import { ToolbarItems, ContextMenu, TreeGridComponent, EditSettingsModel, EditService, ToolbarService, Filter, PageService, FreezeService, Freeze, TreeClipboard } from '@syncfusion/ej2-angular-treegrid';
import { ContextMenuClickEventArgs, DialogEditEventArgs, frozenLeft, leftRight, ContextMenuItemModel } from '@syncfusion/ej2-angular-grids';
import { SaveEventArgs } from "@syncfusion/ej2-grids";
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { CheckBox } from '@syncfusion/ej2-angular-buttons';
import { ResizeService } from '@syncfusion/ej2-angular-treegrid';
import { SharedService } from './treegrid/shared.service'
import { Fields } from '@syncfusion/ej2-angular-dropdowns';
import { ClipboardModule } from '@angular/cdk/clipboard';

TreeGrid.Inject(Selection, ColumnChooser, Filter, Reorder, Resize, RowDD);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [EditService, ResizeService, ToolbarService, PageService, FreezeService],
})
export class AppComponent implements OnInit {
  title = 'Treegrid';
  constructor(private sharedService: SharedService) { }
  @ViewChild('treegrid')
  public treeGridObj!: TreeGridComponent;
  public response!: Object[];
  public targetElement: HTMLElement | undefined;
  public editSettings: Object | undefined;
  public filterSettings: Object | undefined;
  public contextMenuItems1: Object[] | undefined;
  public headerItems: Object[] | undefined;
  public visible: Boolean = false;
  public position: any = { X: 'center', Y: 'center' }
  public taskData!: ITaskModel
  public toolbar: String[] | undefined;
  public selectionOptions: SelectionSettingsModel | undefined;
  public columnName: Object[] | undefined;
  rowIndex: any;
  cellIndex: any;
  copyContent: any;
  @ViewChild('alertDialog') alertDialog!: DialogComponent;
  @ViewChild('alertDialogDel') alertDialogDel!: DialogComponent;
  @ViewChild('template') template!: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef })
  container!: ElementRef;
  public proxy: any = this;
  columns: Array<any> = new Array;

  ngOnInit(): void {
    this.refreshData();
    this.editSettings = { allowResizing: true, allowEditing: true, allowAdding: true, allowDeleting: true, allowFiltering: true, showDeleteConfirmDialog: true, newRowPosition: 'Child', showColumnChooser: true, mode: "Dialog" };
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Both', mode: 'Immediate' };
    this.contextMenuItems1 = [{ text: 'AddNext', target: '.e-content', }, { text: 'AddChild', target: '.e-content', }, { text: 'DelRow', target: '.e-content', }, { text: 'EditRow', target: '.e-content', }, { text: 'MultiSelect', target: '.e-content', },
    { text: 'CutRows', target: '.e-content', },
    { text: 'PasteChild', target: '.e-content', },
    { text: 'Copy', target: '.e-content', id: 'copy' } as ContextMenuItemModel,
    { text: 'Paste', target: '.e-content', id: 'paste' } as ContextMenuItemModel,
    ];
    this.headerItems = [{ text: 'EditCol', target: '.e-headercontent', id: 'editcolom' }, { text: 'NewCol', target: '.e-headercontent' }, { text: 'DelCol', target: '.e-headercontent' }, { text: 'ChooseCol', target: '.e-headercontent' }, { text: 'FreezeCol', target: '.e-headercontent' }, { text: 'FilterCol', target: '.e-headercontent' }, { text: 'MultiSort', target: '.e-headercontent' }]
    this.toolbar = ["Add", "Edit", "Delete", "Update", "Cancel", "ColumnChooser"];
    this.initializeTarget();
  }
  public initializeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  }
  public height: string = '200px';
  public dialogOpen: EmitType<object> = () => {
    (document.getElementById('sendButton') as HTMLElement).onclick = (): void => {
      var inputValue = (<HTMLInputElement>document.getElementById('inVal')).value;
      let columnName = inputValue;
      this.columns.push(Object.assign({}, { field: columnName, headerText: columnName, width: "90" }));
      this.treeGridObj.refreshColumns();
    };
  }
  public dialogOpenEditCol: EmitType<object> = () => {
    (document.getElementById('sendButton1') as HTMLElement).onclick = (): void => {
      var inputValue = (<HTMLInputElement>document.getElementById('inEditCol')).value;
      var inputValue1 = (<HTMLInputElement>document.getElementById('inVal1')).value;
      let columnName = inputValue;
      let columnName1 = inputValue1;
      const column = this.treeGridObj.getColumnByField(inputValue)
      this.treeGridObj.getColumnByField(inputValue).customAttributes = { class: 'customcss' };
      column.headerText = columnName1;
      // var col = { columnName1, columnName }
      // debugger
      // this.sharedService.EditNewCol(col).subscribe(res => {
      //   console.log('res', res);
      // },
      //   error => {
      //     console.log('res', error);
      //   });
      //assign a new header text to the column        
      this.treeGridObj.refreshColumns();
    };
  }
  public dialogOpenDeleteCol: EmitType<object> = () => {
    (document.getElementById('sendButtonDel') as HTMLElement).onclick = (): void => {
      var inputValue = (<HTMLInputElement>document.getElementById('inDelCol')).value;
      var index = this.treeGridObj.getColumnIndexByField(inputValue as any)
      if (confirm("Are you sure to delete?") == true) {
        if (index >= 0) {
          var col = { inputValue }
          this.sharedService.DelCol(col).subscribe(res => {
            console.log('res', res);
          },
            error => {
              console.log('res', error);
            });
          this.treeGridObj.columns.splice(index, 1)
          this.treeGridObj.refreshColumns();
        }
      } else {
      }

    };
  }
  // Sample level code to handle the button click action
  public onOpenDialog = (event: any): void => {
    this.alertDialog.show();
  }
  public onOpenDialogAdd = (event: any): void => {
    this.template.show();
  }
  public onOpenDialogDel = (event: any): void => {
    this.alertDialogDel.show();
  }
  refreshData() {
    this.sharedService.getAccountData().subscribe((data: any) => {
      this.response = data
      var keys = Object.keys(data[0]);

      this.columns = keys
      this.treeGridObj.getColumnByField("TaskID").isPrimaryKey = true;


    },
      err => {
        console.log('error', err);
      });
  }
  actionBegin(args: SaveEventArgs): void {
    // if (args.requestType === "beginEdit" || args.requestType === "add") {
    //   alert(args.rowData?.valueOf);
    //   this.taskData = Object.assign({}, args.rowData);
    // }
    if (args.action == "add") {

      this.sharedService.saveAccountData(args.data).subscribe(res => {
        console.log('res', res);
        this.treeGridObj.refresh();
      },
        error => {
          console.log('res', error);
        });

    }
    if (args.action == "edit") {

      this.sharedService.UpdateAccountData(args.data).subscribe(res => {
        console.log('res', res);
        this.treeGridObj.refresh();
      },
        error => {
          console.log('res', error);
        });
    }
    if (args.requestType == "delete") {
      this.sharedService.DeleteAccountData(args.data).subscribe(res => {
        console.log('res', res);

      },
        error => {
          console.log('res', error);
        });
    }

  }
  public itemSelect(args: MenuEventArgs): void {
    if (args.item.text === "EditCol") {
      let element: HTMLElement = document.getElementById('targetButton') as HTMLElement;
      element.click();

    }
    if (args.item.text === "NewCol") {

      let element: HTMLElement = document.getElementById('targetButtonAdd') as HTMLElement;
      element.click();
    }
    if (args.item.text === "DelCol") {
      let element: HTMLElement = document.getElementById('targetButtonDel') as HTMLElement;
      element.click();
    }
    if (args.item.text === "ChooseCol") {
      let element: HTMLElement = document.getElementsByClassName('e-tbar-btn e-tbtn-txt e-control e-btn e-lib')[5] as HTMLElement;
      element.click();
      let element1: HTMLElement = document.getElementById('_gridcontrol_ccdlg') as HTMLElement;
      element1.style.left = "524px";
      // give X and Y axis
    }
    if (args.item.text === "FreezeCol") {
      this.treeGridObj.frozenColumns = 1;
    }
    if (args.item.text === "FilterCol") {

      let element1: HTMLElement = document.getElementsByClassName('e-filterbar')[0] as HTMLElement;
      element1.style.display = "contents";
    }
    if (args.item.text === "MultiSort") {
      var columns = this.treeGridObj.getColumns()
      for (let i = 0; i < columns.length; i++) {
        this.treeGridObj.sortByColumn(columns[i].field, 'Ascending', true);
      }
    }
  }

  contextMenuOpen(args: { rowInfo: { rowIndex: any; cellIndex: any; }; }): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
  }
  contextMenuClick(args: ContextMenuClickEventArgs) {
    if (args.item.text === "AddNext") {
      let element: HTMLElement = document.getElementsByClassName('e-tbar-btn e-tbtn-txt e-control e-btn e-lib')[0] as HTMLElement;
      element.click();
      let element1: HTMLElement = document.getElementsByClassName('e-float-input e-control-wrapper')[0] as HTMLElement;
      element1.style.display = "none"
    }
    if (args.item.text === "AddChild") {

      var idx: any = args.rowInfo?.rowIndex
      this.sharedService.getAccountData().subscribe((data: any) => {

        var length = data.length
        var id = length + 1
        var data1 = { TaskID: id };
        this.treeGridObj.addRecord(data1, idx, "Child");
      },
        err => {
          console.log('error', err);
        });


    }
    if (args.item.text === "EditRow") {
      let element: HTMLElement = document.getElementsByClassName('e-tbar-btn e-tbtn-txt e-control e-btn e-lib')[1] as HTMLElement;
      element.click();
      let element1: HTMLElement = document.getElementsByClassName('e-float-input e-control-wrapper e-valid-input')[0] as HTMLElement;
      element1.style.display = "none"
    }
    if (args.item.text === "DelRow") {
      let element: HTMLElement = document.getElementsByClassName('e-tbar-btn e-tbtn-txt e-control e-btn e-lib')[2] as HTMLElement;
      element.click();
    }
    if (args.item.text === "MultiSelect") {
      this.selectionOptions = { type: 'Multiple' };
    }
    if (args.item.text === "CopyRows") {
      this.selectionOptions = {
        type: 'Multiple',
        mode: 'Cell',
        cellSelectionMode: 'Box',
      };
      this.editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Batch',
      }
      this.treeGridObj.copy();
      this.treeGridObj.getSelectedRowIndexes();  // get the selected row indexes.
      let element: HTMLElement = document.getElementsByClassName('e-rowcell e-detailrowvisible e-selectionbackground e-active')[0] as HTMLElement;

    }
    if (args.item.text === "PasteNext") {
      var rowIndex = this.rowIndex;
      var cellIndex = this.cellIndex;
      var copyContent = this.treeGridObj.clipboardModule;
      this.treeGridObj.paste(copyContent.copy.name, rowIndex, cellIndex);
    }
    if (args.item.id === 'copy') {
      this.selectionOptions = {
        type: 'Multiple',
        mode: 'Cell',
        cellSelectionMode: 'Box',
      };
      this.editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Batch',
      }
      this.treeGridObj.copy();
    }

    else if (args.item.id === 'paste') {
      var rowIndex = this.rowIndex;
      var cellIndex = this.cellIndex;
      this.copyContent = (this.treeGridObj.clipboardModule) as TreeClipboard;
      this.treeGridObj.paste(this.copyContent.copyContent, rowIndex, cellIndex);

    }
    if (args.item.text === "PasteChild") {
      var rowIndex = this.rowIndex;
      var cellIndex = this.cellIndex;
      this.copyContent = (this.treeGridObj.clipboardModule) as TreeClipboard;
      this.treeGridObj.paste(this.copyContent.copyContent, rowIndex, cellIndex);
      console.log(this.copyContent);
    }
  }

  public beforeClose(args: BeforeOpenCloseMenuEventArgs) {
    if ((args.event.target as Element).closest('.e-menu-item')) {
      args.cancel = true;
      let selectedElem: NodeList = args.element.querySelectorAll('.e-selected');
      for (let i: number = 0; i < selectedElem.length; i++) {
        let ele: Element = selectedElem[i] as Element;
        ele.classList.remove('e-selected');
      }
      let checkbox: HTMLElement = closest(args.event.target as Element, '.e-checkbox-wrapper') as HTMLElement;
      let frame: HTMLElement = checkbox.querySelector('.e-frame') as HTMLElement;
      if (checkbox && frame.classList.contains('e-check')) {
        if (args.items[5].text === "FilterCol") {
          let element1: HTMLElement = document.getElementsByClassName('e-filterbar')[0] as HTMLElement;
          element1.style.display = "none";
        }
        if (args.items[6].text === "MultiSort") {
          var columns = this.treeGridObj.getColumns()
          for (let i = 0; i < columns.length; i++) {
            this.treeGridObj.removeSortColumn(columns[i].field);
          }
        }
        if (args.items[4].text === "FreezeCol") {
          // this.treeGridObj.frozenColumns=false;
        }
        frame.classList.remove('e-check');
      } else if (checkbox) {
        frame.classList.add('e-check');
      }
    }
  }
  public itemRender(args: MenuEventArgs) {
    let check: Element = createCheckBox(createElement, false, {
      label: args.item.text,
      checked: (args.item.text == 'Option 2') ? true : false
    });
    args.element.innerHTML = '';
    args.element.appendChild(check);
  }
}
export interface ITaskModel {
  taskID?: Number;
  taskName?: String;
  startDate?: Date;
  duration?: Number;
  progress?: Number;
  priority?: String;
  approved?: Boolean;
}
function detach(arg0: Element) {
  throw new Error('Function not implemented.');
}

