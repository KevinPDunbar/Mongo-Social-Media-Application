import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { NativeStorage } from '@ionic-native/native-storage';

import { LoginFormPage } from '../../pages/login-form/login-form';
import { FeedPage } from '../../pages/feed/feed';


const URL = 'http://192.168.2.125:8000/api';

/*
  Generated class for the AuthDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthDataProvider {

    data: any;

    constructor(public http: Http, private nativeStorage: NativeStorage) {
      console.log('Hello AuthDataProvider Provider');
      this.data = null;
  }

  loginUser(email: string, password: string) {

      let user = { "email": email, "password": password };

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/loginUser', JSON.stringify(user), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json())
              {
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
                              //this.navCtrl.setRoot(FeedPage);
                              
                          }
                      }

                      )
              }
              else if(!res.json()) {
                  console.log("nothing");
              }
              
          });
      

  }

  logoutUser() {
      this.nativeStorage.remove('User')
          .then(
          () => console.log('item Removed!'),
          error => console.error('Error removing item', error)
          );

      
  }

    getUsers() {

        if (this.data) {
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {

            this.http.get(URL + '/users')
                .map(res => res.json())
                .subscribe(data => {
                    this.data = data;
                    resolve(this.data);
                });
        });

    }

    createUser(email, password, firstName, lastName) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let user = {
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        }

        return this.http.post(URL + '/createUser', JSON.stringify(user), { headers: headers })
            .subscribe(res => {
                console.log(res.json());
                if (res.json() === "User Created")
                {
                    //console.log("DONE");
                    //this.navCtrl.push(LoginFormPage);
                    //return (res.json());
                }
            });

    }

    deleteUser(id) {
        this.http.delete(URL + '/users/' + id).subscribe((res) => {
            console.log(res.json());
        });

    }

}
