import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import 'jquery';
@Component({
  selector: 'register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss']
})

export class registerLoginComponent implements OnInit {
  title = 'register-login';
  userDtail: any = {}; data: any = {}; navigation: any;
  ulang: any = '';
  locationName: string = '';
  constructor(location: Location,private titleService: Title) {
    this.locationName = location.path();
  }

  ngOnInit() {
    this.titleService.setTitle("Leaders Development Mission - Register");
  }

}
