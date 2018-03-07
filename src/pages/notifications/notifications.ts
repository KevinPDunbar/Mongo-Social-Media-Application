import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers } from '@angular/http';

import { ViewProfilePage } from '../view-profile/view-profile';
import { ViewPostPage } from '../view-post/view-post';


const URL = 'http://192.168.2.125:8000/api';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

    userId: any;
    public notifications = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nativeStorage: NativeStorage) {
        let id = this.userId;

        this.nativeStorage.getItem('User')
            .then(
            (data) => {
                if (data !== null) {
                    let id = data.Id;
                    console.log("THE ID IS: " + id);
                    this.userId = id;
                    this.getNotifications();
                }
            }

            )
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.notifications = [];
      this.getNotifications();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

  viewPost(commentOwnerId, postId, notificationId) {
      console.log("THE PASSED IN ID :" + commentOwnerId);
      console.log("THE PASSED IN POST ID : " + postId);

      for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].notificationId === notificationId) {
              this.notifications[i].read = true;
              break;
          }
      }

      console.log("The notifications ID is: " + notificationId);
      let req = { "_id": notificationId };


      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/setNotificationAsRead', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

      this.navCtrl.push(ViewPostPage, {
          userId: commentOwnerId,
          postId: postId
      })
  }

  viewProfile(pusherId, notificationId) {
      console.log("TPusher ID :" + pusherId);

      for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].notificationId === notificationId) {
              this.notifications[i].read = true;
              break;
          }
      }

      console.log("The notifications ID is: " + notificationId);
      let req = { "_id": notificationId };


      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/setNotificationAsRead', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

      this.navCtrl.push(ViewProfilePage, {
          userId: pusherId
      })
  }

  getNotifications() {

      let myId = this.userId;
      let notificationsClone = this.notifications;

     

      let req = { "userId": this.userId };


      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/getAllNotifications', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log("Unread Response: " + res.json());
                  console.log("Ledngth: " + res.json().length);

                  for (let i = 0; i < res.json().length; i++) {

                      

                      let pusherId = res.json()[i].pusherId;
                      let read = res.json()[i].read;
                      let subject = res.json()[i].subject;
                      let commentOwnerId = res.json()[i].commentOwnerId;
                      let postId = res.json()[i].postId;
                      let date = res.json()[i].date;
                      let notificationId = res.json()[i]._id;

                      let req = { "userId": res.json()[i].pusherId };

                      let headers = new Headers();
                      headers.append('Content-Type', 'application/json');

                      //
                      this.http.post(URL + '/getUserById', JSON.stringify(req), { headers: headers })
                          .subscribe(res => {
                              //console.log(res.json());
                              if (res.json()) {
                                  console.log(res.json());

                                  let pusherName = res.json().firstName + " " + res.json().lastName;
                                 
                                  let pusherPhotoURL = res.json().profilePicture;


                                  notificationsClone.push({ "pusherName": pusherName, "pusherPhotoURL": pusherPhotoURL, "read": read, "subject": subject, "commentOwnerId": commentOwnerId, "postId": postId, "pusherId": pusherId, "notificationId": notificationId, "date": date });
                              }
                              else if (!res.json()) {
                                  console.log("nothing user");
                              }

                          });
                      //

                      
                      //notificationsClone.push({ "pusherName": pusherName, "pusherPhotoURL": pusherPhotoURL, "read": read, "subject": subject, "commentOwnerId": commentOwnerId, "postId": postId, "pusherId": pusherId, "notificationId": notificationId, "date": date });
                      
                      
                  }

                 

              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });
  }

}
