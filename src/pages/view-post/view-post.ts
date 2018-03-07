import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { NotificationsPage } from '../notifications/notifications';
import { ViewProfilePage } from '../view-profile/view-profile'


const URL = 'http://192.168.2.125:8000/api';

/**
 * Generated class for the ViewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
})
export class ViewPostPage {

    userId: any;
    public users = [];
    public posts = [];
    public comments = [];
    public unreadNotifications = [];

    public passedUserId;
    public passedPostId;
    public postOwnerId;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, private nativeStorage: NativeStorage, private view: ViewController) {

        this.passedUserId = navParams.get("userId");
        console.log("PASSED USER ID : " + this.passedUserId);
        this.passedPostId = navParams.get("postId");
        console.log("PASSED POST ID :" + this.passedPostId);

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
      console.log('ionViewDidLoad ViewPostPage');
      this.getPost();
      //this.addComment();
      this.whoAmIFollowing();
      this.getComments();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.users = [];
      this.posts = [];
      this.comments = [];
      this.unreadNotifications = [];
      this.getPost();
      this.whoAmIFollowing();
      this.getComments();
      this.getUnreadCount();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

  viewProfile(userId) {
      console.log("THE PASSED IN ID :" + userId);
      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewProfilePage, {
          userId: userId
      })
  }

  closeModal() {
      this.view.dismiss();
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

  getPost() {

  }

  getComments() {
      let commentsClone = this.comments;

      let id;
      let firstName;
      let lastName;
      let aboutMe;
      let following;

      
      let followingResponse;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let req = { "_id": this.passedPostId };

      this.http.post(URL + '/getCommentsById', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {

                  let resp = res.json();
                  
                  

                  console.log("RESPONSE: " + res.json().text);

                  for (let i = 0; i < resp.length; i++)
                  {
                      let userId
                      let commentId;
                      let commentText;
                      let commentDate;

                      userId = resp[i].userId;
                      commentText = resp[i].text;
                      commentDate = resp[i].date;
                      console.log("COMMENT TEXT:" + commentText);

                      let posterName;
                      let posterPhotoUrl;

                      
                     

                      //
                      let headers = new Headers();
                      headers.append('Content-Type', 'application/json');

                      let req = { "userId": userId };

                      this.http.post(URL + '/getUserById', JSON.stringify(req), { headers: headers })
                          .subscribe(res => {
                              //console.log(res.json());
                              if (res.json()) {
                                  console.log(res.json());

                                  let firstName = res.json().firstName;
                                  let lastName = res.json().lastName;
                                  let photoURL = res.json().profilePicture;

                                  let d = new Date(commentDate);
                                  let day = d.getDay();
                                  let month = d.getMonth();
                                  let year = d.getFullYear();

                                  let newDate = day + '/' + month + '/' + year;

                                  posterName = firstName + " " + lastName;
                                  posterPhotoUrl = photoURL;


                                  console.log("THE POSTER: " + posterName);
                                  

                                  commentsClone.push({ "name": posterName, "text": commentText, "photoURL": posterPhotoUrl, "date": newDate, "userId": userId });

                                  //postClone.name = posterName;
                                  //postClone.photoURL = posterPhotoUrl;

                              }
                              else if (!res.json()) {
                                  console.log("nothing");
                              }

                          });
                  }

              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });




  }
  whoAmIFollowing() {
      let userClone = this.users;
      let postClone = this.posts;

      function msToTime(s) {
          var ms = s % 1000;
          s = (s - ms) / 1000;
          var secs = s % 60;
          s = (s - secs) / 60;
          var mins = s % 60;
          var hrs = (s - mins) / 60;
          if (hrs == 0 && mins == 0)
              return 'just now';
          else if (hrs == 0)
              return mins + ' mins ago';
          else if (hrs < 24)
              return hrs + ' hours ago';
          else
              return Math.floor(hrs / 24) + ' days ago';
      }

      let id;
      let firstName;
      let lastName;
      let aboutMe;
      let following;

      let followingResponse;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let req = { "_id": this.passedPostId };

      this.http.post(URL + '/getPostById', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {

                  let postId;
                  let userId;
                  let postText;
                  let postDate;
                  let postScore;
                  let postPhotoURL;

                  let posterName;
                  let posterPhotoUrl;

                  followingResponse = res.json();
                  let response = res.json();
                  console.log("Following response: " + res.json());
                  console.log("Following length: " + res.json().length);
                      console.log("response " + " " + response.text);
                      postId = response._id;
                      this.postOwnerId = response.userId;
                      userId = response.userId;
                      postText = response.text;
                      postDate = response.date;
                      postScore = response.score;
                      postPhotoURL = response.image;

                      //
                      let headers = new Headers();
                      headers.append('Content-Type', 'application/json');

                      let req = { "userId": userId };

                      this.http.post(URL + '/getUserById', JSON.stringify(req), { headers: headers })
                          .subscribe(res => {
                              //console.log(res.json());
                              if (res.json()) {
                                  console.log(res.json());

                                  let firstName = res.json().firstName;
                                  let lastName = res.json().lastName;
                                  let photoURL = res.json().profilePicture;

                                  posterName = firstName + " " + lastName;
                                  posterPhotoUrl = photoURL;


                                  console.log("THE POSTER: " + posterName);
                                  console.log("Place: " + response._id);

                                  let reqq = { "_id": postId };
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

                                              userClone[0].haveILiked = haveILiked;
                                              //postClone[i].likes = res.json();

                                          }
                                          else if (!res.json()) {
                                              console.log("nothing");
                                          }

                                      });
                                  //
                                  userClone.push({ "postId": postId, "userId": userId, "name": posterName, "text": postText, "date": diff, "score": postScore, "photoURL": posterPhotoUrl, "postPhotoURL": postPhotoURL, "likes": "", "haveILiked": "" });

                                  

                              }
                              else if (!res.json()) {
                                  console.log("nothing");
                              }

                          });
                      //

                      let now = new Date().getTime();
                      let past = new Date(postDate).getTime();

                      let diff = msToTime(now - past);

                      let d = new Date(postDate);
                      let day = d.getDay();
                      let month = d.getMonth();
                      let year = d.getFullYear();

                      let newDate = day + '/' + month + '/' + year;

                     // postClone.push({ "postId": postId, "userId": userId, "name": "", "text": postText, "date": newDate, "score": postScore, "photoURL": "", "postPhotoURL": postPhotoURL });


                  

              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });




  }

  showPrompt() {
      let prompt = this.alertCtrl.create({
          title: 'New Comment',
          message: "Enter your next post here",
          inputs: [
              {
                  name: 'text',
                  placeholder: 'Post'
              },
          ],
          buttons: [
              {
                  text: 'Cancel',
                  handler: data => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Create',
                  handler: data => {
                      console.log('Saved clicked');
                      console.log(data.text);
                      let newCommentText = data.text;
                      this.addComment(newCommentText);


                  }
              }
          ]
      });
      prompt.present();

  }


  addComment(newCommentText) {

      let userId = this.passedUserId;
      let postId = this.passedPostId;
      
      let existingComments = this.comments;

      let date = new Date();

      let comment = { "userId": this.userId, "postId": postId, "date": date, "text": newCommentText };


      //
      //
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let req = { "userId": this.userId };

      this.http.post(URL + '/getUserById', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());

                  let firstName = res.json().firstName;
                  let lastName = res.json().lastName;
                  let photoURL = res.json().profilePicture;

                  let posterName = firstName + " " + lastName;
                  let posterPhotoUrl = photoURL;

                  existingComments.unshift({ "text": newCommentText, "name": posterName, "userId": this.userId, "photoURL": photoURL });

              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });
      //

      this.http.post(URL + '/newComment', JSON.stringify(comment), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
                  //
                  let headers = new Headers();
                  headers.append('Content-Type', 'application/json');

                  let date = new Date();

                  let notification = { "recieveId": userId, "pusherId": this.userId, "subject": "comment", "read": false, "commentOwnerId": this.postOwnerId, "postId": this.passedPostId, "date": date };

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
                  //

              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });


  }

  likePost(post, userId, postId) {

      let ownerId = userId;
      let myId = this.userId;
      let likes = [];

      console.log("post: " + post.postId);
      for (let i = 0; i < this.users.length; i++)
          if (this.users[i].postId === postId) {
              console.log("POST FOUND and liked");
              this.users[i].haveILiked = true;
              this.users[i].score++;
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
      for (let i = 0; i < this.users.length; i++)
          if (this.users[i].postId === postId) {
              console.log("POST FOUND and unliked");
              this.users[i].haveILiked = false;
              this.users[i].score--;
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
