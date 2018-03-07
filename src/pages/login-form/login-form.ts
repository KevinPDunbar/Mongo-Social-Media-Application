import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams, LoadingController,
    AlertController
} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { EmailValidator } from '../../validators/email';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { NativeStorage } from '@ionic-native/native-storage';

import { SignupPage } from '../signup/signup';
import { FeedPage } from '../feed/feed';


const URL = 'http://192.168.2.125:8000/api';

@IonicPage()
@Component({
  selector: 'page-login-form',
  templateUrl: 'login-form.html',
})
export class LoginFormPage {

    public loginForm;
    loading: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController,
        public nav: NavController, public AuthDataProvider: AuthDataProvider, public http: Http, private nativeStorage: NativeStorage) {

        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });

        this.nativeStorage.getItem('User')
            .then(
            data => this.navCtrl.setRoot(FeedPage),
            error => console.error(error)
            );
        

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginFormPage');
  }

  goToSignup() {
      this.navCtrl.push(SignupPage);
  }

  loginUser() {
      if (!this.loginForm.valid) {
          console.log(this.loginForm.value);
      } else {

          //this.AuthDataProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password);
          //this.navCtrl.setRoot(FeedPage);

          let user = { "email": this.loginForm.value.email, "password": this.loginForm.value.password };

          let headers = new Headers();
          headers.append('Content-Type', 'application/json');

          this.http.post(URL + '/loginUser', JSON.stringify(user), { headers: headers })
              .subscribe(res => {
                  //console.log(res.json());
                  if (res.json()) {
                      console.log(res.json());
                      console.log("The returned id: " + res.json()._id)
                      this.nativeStorage.setItem('User', { Id: res.json()._id, firstName: res.json().firstName, lastName: res.json().lastName, email: res.json().email })
                          .then(
                          () => console.log('Stored item!'),
                          error => console.error('Error storing item', error)
                          );


                      this.nativeStorage.getItem('User')
                          .then(
                          (data) => {
                              if (data !== null) {
                                  let id = data.Id;
                                  console.log("ITEM FOUND");
                                  this.navCtrl.setRoot(FeedPage);

                              }
                          }

                          ) 
                  }
                  else if (!res.json()) {
                      console.log("nothing");
                  }

              });
      }
  }

}
