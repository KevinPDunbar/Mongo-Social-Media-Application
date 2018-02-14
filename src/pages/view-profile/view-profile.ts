import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

const URL = 'http://192.168.2.108:8000/api';
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

    public follows = [];
    public isFollowing = false;

    userId;
    myId;

    public usersName;
    public usersPhoto;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nativeStorage: NativeStorage) {

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

      this.getUser();
      this.getUsersPosts();
      this.amIFollowing();

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

  }

  getUsersPosts() {

      let postId;
      let text;
      let score;
      let date;
      let postPhotoURL;

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

                      let d = new Date(date);
                      let day = d.getDay();
                      let month = d.getMonth();
                      let year = d.getFullYear();

                      let newDate = day + '/' + month + '/' + year;

                      postClone.push({ "postId": postId, "name": this.usersName, "text": text, "date": newDate, "score": score, "postPhotoURL": postPhotoURL, "photoURL": this.usersPhoto });
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

}
