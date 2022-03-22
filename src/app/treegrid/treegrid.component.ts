import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-treegrid',
  templateUrl: './treegrid.component.html',
  styleUrls: ['./treegrid.component.css']
})
export class TreegridComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {


    // this.http.get('http://localhost:3000/JsonFileData/list')
    //   .subscribe(Response => {

    //     // If response comes hideloader() function is called
    //     // to hide that loader
    //     // alert("Connect");
    //     console.log(Response)

    //   });
  }


}
