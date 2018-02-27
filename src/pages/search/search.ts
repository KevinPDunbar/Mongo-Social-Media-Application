import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { ViewProfilePage } from '../view-profile/view-profile';
import { MyProfilePage } from '../my-profile/my-profile';
import { NotificationsPage } from '../notifications/notifications';


const URL = 'http://192.168.2.115:8000/api';

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
    public unreadNotifications = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nativeStorage: NativeStorage) {

        let id = this.userId;

        this.nativeStorage.getItem('User')
            .then(
            (data) => {
                if (data !== null) {
                    let id = data.Id;
                    console.log("THE ID IS: " + id);
                    this.userId = id;
                    this.getUnreadCount();
                }
            }

            )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  goToNotificationsPage() {
      this.navCtrl.push(NotificationsPage);
  }

  getUnreadCount() {

      let myId = this.userId;
      let unreadClone = this.unreadNotifications;

      let req = { "userId": this.userId };


      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/getUnreadCount', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log("Unread Response: " + res.json());
                  console.log("Ledngth: " + res.json().length);

                  for (let i = 0; i < res.json().length; i++) {
                      unreadClone.push(1);
                  }



              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });
  }

  search($event) {



      this.users = [];

      let results = this.users;

      let term = $event.target.value || '';
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
