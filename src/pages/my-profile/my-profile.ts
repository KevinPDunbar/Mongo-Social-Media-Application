import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';

import { EditProfilePage } from '../edit-profile/edit-profile';
import { NotificationsPage } from '../notifications/notifications';
import { ViewPostPage } from '../view-post/view-post';


const URL = 'http://192.168.2.115:8000/api';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

    public posts = [];
    public users = [];
    public unreadNotifications = [];

    userId: any;

    usersName: String;
    usersPhoto: String;

    constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, public http: Http) {


  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad MyProfilePage');

      this.nativeStorage.getItem('User')
          .then(
          (data) => {
              if (data !== null) {
                  let id = data.Id;
                  console.log("THE ID IS: " + id);
                  this.userId = id;
                  this.getUser();
                  this.getMyPosts();
                  this.getUnreadCount();
              }
          }
        
          )
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

  editProfile()
  {
      this.navCtrl.push(EditProfilePage);
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.posts = [];
      this.users = [];
      this.unreadNotifications = [];
      this.getUser();
      this.getMyPosts();
      this.getUnreadCount();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }
 

  getUser() {

      let id;
      let firstName;
      let lastName;
      let aboutMe;
      let photoURL;


     let req = { "userId": this.userId };

     let userClone = this.users;

     let headers = new Headers();
     headers.append('Content-Type', 'application/json');

     this.http.post(URL + '/getUserById', JSON.stringify(req), { headers: headers })
         .subscribe(res => {
             //console.log(res.json());
             if (res.json()) {
                 console.log(res.json());
                 id = res.json().id;
                 firstName = res.json().firstName;
                 lastName = res.json().lastName;
                 aboutMe = res.json().aboutMe;
                 photoURL = res.json().profilePicture;

                 this.usersName = firstName + " " + lastName;
                 this.usersPhoto = photoURL;
                 userClone.push({ "id": id, "firstName": firstName, "lastName": lastName, "aboutMe": aboutMe, "photoURL": photoURL })
             }
             else if (!res.json()) {
                 console.log("nothing");
             }

         });

     //userClone.push({ "id": "fjfbbj", "firstName": "Kevin", "lastName": "Dunbar", "aboutMe": "this is my bio", "photoURL": "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a" });
     
  }

  getMyPosts() {

      let postId;
      let text;
      let score;
      let date;
      let image;

      let req = { "userId": this.userId };

      let postClone = this.posts;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post( URL + '/getUsersPosts', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
                  console.log("Ledngth: " + res.json().length);
                  let results = res.json();
                  console.log("First RESULTS: " + results[0].text);

                  for (let i = 0; i < res.json().length; i++)
                  {
                      let content = res.json();
                      postId = content[i]._id;
                      text = content[i].text;
                      date = content[i].date;
                      score = content[i].score;
                      image = content[i].image;

                      let d = new Date(date);
                      let day = d.getDay();
                      let month = d.getMonth();
                      let year = d.getFullYear();

                      let newDate = day + '/' + month + '/' + year;

                      let reqq = { "_id": postId };

                      this.http.post(URL + '/getCommentsById', JSON.stringify(reqq), { headers: headers })
                          .subscribe(res => {
                              //console.log(res.json());
                              if (res.json()) {

                                  console.log("Commetns Lenght: " + res.json().length);
                                  let commentLength = res.json().length;
                                  postClone[i].commentLength = commentLength;

                              }
                              else if (!res.json()) {
                                  console.log("nothing");
                              }

                          });

                      //
                      this.http.post(URL + '/getLikesById', JSON.stringify(reqq), { headers: headers })
                          .subscribe(res => {
                              //console.log(res.json());
                              if (res.json()) {

                                  console.log("Likes are: " + res.json().length);

                                  let haveILiked = false;
                                  for (let i = 0; i < res.json().length; i++) {
                                      if (res.json()[i].userId === this.userId) {
                                          haveILiked = true;
                                      }
                                  }

                                  postClone[i].haveILiked = haveILiked;
                                  //postClone[i].likes = res.json();

                              }
                              else if (!res.json()) {
                                  console.log("nothing");
                              }

                          });


                      let name = "test Name";
                      postClone.push({ "postId": postId, "name": this.usersName, "text": text, "date": date, "score": score, "photoURL": this.usersPhoto, "commentLength": 0, "postPhotoURL": image, "likes": "", "haveILiked": "" });
                  }
                  
                  
                  //aboutMe = res.json().aboutMe;


                  //userClone.push({ "id": id, "firstName": firstName, "lastName": lastName, "aboutMe": aboutMe, "photoURL": "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a" })
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

  }

  deletePost(post) {

      

      //Remove locally
      let index = this.posts.indexOf(post);

      if (index > -1) {
          this.posts.splice(index, 1);
      }

      let req = post;

      console.log("Post is: " + post.postId);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/deletePost', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
               
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });



      

  }

  viewPost(userId, postId) {

      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewPostPage, {
          userId: userId,
          postId: postId
      })
  }

  likePost(post, userId, postId) {

      let ownerId = this.userId;
      let myId = this.userId;
      let likes = [];

      console.log("post: " + post.postId);
      for (let i = 0; i < this.posts.length; i++)
          if (this.posts[i].postId === postId) {
              console.log("POST FOUND and liked");
              this.posts[i].haveILiked = true;
              this.posts[i].score++;
              break;
          }

      let h = new Headers();
      h.append('Content-Type', 'application/json');

      let reqq = { "userId": myId, "postId": postId };

      this.http.post(URL + '/likePost', JSON.stringify(reqq), { headers: h })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {

                  console.log("Like Successful");
                  let headers = new Headers();
                  headers.append('Content-Type', 'application/json');

                  let date = new Date();

                  let notification = { "recieveId": ownerId, "pusherId": myId, "subject": "like", "read": false, "commentOwnerId": ownerId, "postId": postId, "date": date };

                  this.http.post(URL + '/newNotification', JSON.stringify(notification), { headers: headers })
                      .subscribe(res => {
                          //console.log(res.json());
                          if (res.json()) {
                              console.log(res.json());


                          }
                          else if (!res.json()) {
                              console.log("nothing");
                          }

                      });

              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

  }

  unlikePost(post, userId, postId) {

      let ownerId = userId;
      let myId = this.userId;
      let likes = [];
      let updatedLikes = [];

      console.log("post: " + post.postId);
      for (let i = 0; i < this.posts.length; i++)
          if (this.posts[i].postId === postId) {
              console.log("POST FOUND and unliked");
              this.posts[i].haveILiked = false;
              this.posts[i].score--;
              break;
          }

      let h = new Headers();
      h.append('Content-Type', 'application/json');

      let reqq = { "userId": myId, "postId": postId };

      this.http.post(URL + '/unlikePost', JSON.stringify(reqq), { headers: h })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {

                  console.log("Unlike Successful");

              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });




  }

}
