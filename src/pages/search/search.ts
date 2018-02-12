import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { ViewProfilePage } from '../view-profile/view-profile';
import { MyProfilePage } from '../my-profile/my-profile';

const URL = 'http://192.168.2.108:8000/api';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

    userId: any;
    public users = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nativeStorage: NativeStorage) {

        let id = this.userId;

        this.nativeStorage.getItem('User')
            .then(
            (data) => {
                if (data !== null) {
                    let id = data.Id;
                    console.log("THE ID IS: " + id);
                    this.userId = id;
                }
            }

            )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  search($event) {



      this.users = [];

      let results = this.users;

      let term = $event.target.value
      console.log("Q IS: " + term);

      let q = { "term": term };

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/searchUsers', JSON.stringify(q), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log("Search Response: " + res.json());
                  let response = res.json();
                  for (let i = 0; i < response.length; i++) {
                      let firstName = response[i].firstName;
                      let lastName = response[i].lastName;
                      let photoURL = response[i].profilePicture;
                      let userId = response[i]._id;


                      results.push({ "firstName": firstName, "lastName": lastName, "userId": userId, "photoURL": photoURL });

                  }


              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

      //results.push({ "firstName": firstName, "lastName": lastName, "userId": userId, "photoURL": photoURL });


  }

  viewProfile(userId) {
      console.log("THE PASSED IN ID :" + userId);
      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewProfilePage, {
          userId: userId
      })
  }

}
