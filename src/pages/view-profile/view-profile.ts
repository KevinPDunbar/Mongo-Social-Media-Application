import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { IonicPage, NavController, NavParams, ModalController, ModalOptions   } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { NotificationsPage } from '../notifications/notifications';
import { ViewPostPage } from '../view-post/view-post';


const URL = 'http://192.168.2.125:8000/api';
/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

    public passedUserId;
    public posts = [];
    public users = [];
    public unreadNotifications = [];

    public follows = [];
    public isFollowing = false;

    userId;
    myId;

    public usersName;
    public usersPhoto;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nativeStorage: NativeStorage, private modal: ModalController) {

        this.passedUserId = navParams.get("userId");
        console.log("PASSED USER ID : " + this.passedUserId);
        this.userId = this.passedUserId;

        this.nativeStorage.getItem('User')
            .then(
            (data) => {
                if (data !== null) {
                    let id = data.Id;
                    console.log("THE ID IS: " + id);
                    this.myId = id;
                    this.amIFollowing();
                    this.getUnreadCount();
                }
            }

            )
        
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ViewProfilePage');
      this.getUser();
      this.getUsersPosts();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.posts = [];
      this.users = [];
      this.unreadNotifications = [];

      this.getUser();
      this.getUsersPosts();
      this.amIFollowing();
      this.getUnreadCount();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

  openModal(userId, postId) {

      const options: ModalOptions = {
          showBackdrop: true,
          enableBackdropDismiss: true,
          enterAnimation: 'modal-scale-up-enter',
          leaveAnimation: 'modal-scale-up-leave',

      }

      const myModal = this.modal.create(ViewPostPage, { userId, postId }, options);

      myModal.present();
  }

  goToNotificationsPage() {
      this.navCtrl.push(NotificationsPage);
  }

  getUnreadCount() {

      //let myId = this.userId;
      let unreadClone = this.unreadNotifications;

      let req = { "userId": this.myId };


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

  }

  getUsersPosts() {

      let postId;
      let text;
      let score;
      let date;
      let postUserId;
      let postPhotoURL;

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

      let req = { "userId": this.userId };

      let postClone = this.posts;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/getUsersPosts', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
                  console.log("Ledngth: " + res.json().length);
                  let results = res.json();
                  console.log("First RESULTS: " + results[0].text);

                  for (let i = 0; i < res.json().length; i++) {
                      let content = res.json();
                      postId = content[i]._id;
                      text = content[i].text;
                      date = content[i].date;
                      score = content[i].score;
                      postPhotoURL = content[i].image;
                      postUserId = content[i].userId;

                      let d = new Date(date);
                      let day = d.getDay();
                      let month = d.getMonth();
                      let year = d.getFullYear();

                      let newDate = day + '/' + month + '/' + year;

                      let now = new Date().getTime();
                      let past = new Date(date).getTime();

                      let diff = msToTime(now - past);

                      //
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
                      //
                      postClone.push({ "postId": postId, "name": this.usersName, "text": text, "date": diff, "score": score, "postPhotoURL": postPhotoURL, "photoURL": this.usersPhoto, "likes": "", "haveILiked": "", "userId": postUserId });
                  }


                  //aboutMe = res.json().aboutMe;


                  //userClone.push({ "id": id, "firstName": firstName, "lastName": lastName, "aboutMe": aboutMe, "photoURL": "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a" })
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

  }

  amIFollowing() {

      let idToFollow = this.passedUserId;
      let userId = this.myId;

      this.follows = [];
      let followsClone = this.follows;
      let following;
      let amIFollowing = this.isFollowing;

      let req = { "userId": userId };


      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/getUserById', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
                  following = res.json().following;
                  console.log("FOLLOWING IS: " + following);

                  for (let i = 0; i < following.length; i++) {
                      if (following[i] == idToFollow) {
                          console.log("You are following this user already");
                          amIFollowing = true;
                         

                      }

                  }

                  if (amIFollowing === true) {
                      console.log("You are following this user already");
                      //followButton.innerHTML = "Unfollow";
                      followsClone.push({ "following": true });
                  }
                  else {
                      console.log("You are NOT following this user already");
                      //followButton.innerHTML = "Follow";
                      followsClone.push({ "following": false });
                  }
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

  }

  followUser() {

      let idToFollow = this.passedUserId;
      let userId = this.myId;

      let following;

      let req = { "userId": userId, "idToFollow": idToFollow };


      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/followUser', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
                  this.amIFollowing();

                  //
                  let headers = new Headers();
                  headers.append('Content-Type', 'application/json');

                  let date = new Date();

                  let notification = { "recieveId": idToFollow, "pusherId": userId, "subject": "follow", "read": false, "commentOwnerId": "", "postId": "", "date": date };

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
              };

          })

  }

  unFollowUser() {

      let idToFollow = this.passedUserId;
      let userId = this.myId;

      let following;

      let req = { "userId": userId, "idToFollow": idToFollow };


      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/unfollowUser', JSON.stringify(req), { headers: headers })
          .subscribe(res => {
              //console.log(res.json());
              if (res.json()) {
                  console.log(res.json());
                  this.amIFollowing();

              };

          })
  }

  viewPost(userId, postId) {

      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewPostPage, {
          userId: userId,
          postId: postId
      })
  }

  likePost(post, userId, postId) {

      let ownerId = userId;
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
