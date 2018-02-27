import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';  
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MyProfilePage } from '../my-profile/my-profile';
import { ViewProfilePage } from '../view-profile/view-profile';
import { SearchPage } from '../search/search';
import { ViewPostPage } from '../view-post/view-post';
import { NotificationsPage } from '../notifications/notifications';


const URL = 'http://192.168.2.115:8000/api';
/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

    userId: any;
    public items = [];
    public users = [];
    public unreadNotifications = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, private nativeStorage: NativeStorage, private camera: Camera) {

        let id = this.userId;

        this.nativeStorage.getItem('User')
            .then(
            (data) => {
                if (data !== null) {
                    let id = data.Id;
                    console.log("THE ID IS: " + id);
                    this.userId = id;
                    this.whoAmIFollowing();
                    this.getUnreadCount();
                }
            }

            )

    }

  ionViewDidLoad() {
      console.log('ionViewDidLoad FeedPage');
      //this.getUser();
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.items = [];
      this.users = [];
      this.unreadNotifications = [];
      this.whoAmIFollowing();
      this.getUnreadCount();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
  }

  goToNotificationsPage()
  {
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
                  
                  for (let i = 0; i < res.json().length; i++)
                  {
                      unreadClone.push(1);
                  }


                
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });
  }

  whoAmIFollowing()
  {
      let userClone = this.users;
      let postClone = this.items;

      let id;
      let firstName;
      let lastName;
      let aboutMe;
      let following;

      let followingResponse;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let req = { "userId": this.userId };

      this.http.post(URL + '/getFollowingById', JSON.stringify(req), { headers: headers })
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

                  let commentLength;

                  followingResponse = res.json();
                  let response = res.json();
                  console.log("Following response: " + res.json());
                  console.log("Following length: " + res.json().length);
                  for (let i = 0; i < response.length; i++)
                  {
                      console.log("response " + i + " " + response[i].text);
                      postId = response[i]._id;
                      userId = response[i].userId;
                      postText = response[i].text;
                      postDate = response[i].date;
                      postScore = response[i].score;
                      postPhotoURL = response[i].image;

                      let h = new Headers();
                      h.append('Content-Type', 'application/json');

                      let reqq = { "_id": postId };

                      this.http.post(URL + '/getCommentsById', JSON.stringify(reqq), { headers: h })
                          .subscribe(res => {
                              //console.log(res.json());
                              if (res.json()) {

                                  console.log("Commetns Lenght: " + res.json().length);
                                  commentLength = res.json().length;
                                  postClone[i].commentLength = commentLength;

                              }
                              else if (!res.json()) {
                                  console.log("nothing");
                              }

                          });

                      this.http.post(URL + '/getLikesById', JSON.stringify(reqq), { headers: h })
                          .subscribe(res => {
                              //console.log(res.json());
                              if (res.json()) {

                                  console.log("Likes are: " + res.json().length);
                                  commentLength = res.json().length;
                                  let haveILiked = false;
                                  for (let i = 0; i < res.json().length; i++)
                                  {
                                      if (res.json()[i].userId === this.userId)
                                      {
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
                                  console.log("Place: " + response[i]._id);

                                  postClone[i].name = posterName;
                                  postClone[i].photoURL = posterPhotoUrl;

                              }
                              else if (!res.json()) {
                                  console.log("nothing");
                              }

                          });
                      //

                      let d = new Date(postDate);
                      let day = d.getDay();
                      let month = d.getMonth();
                      let year = d.getFullYear();

                      let newDate = day + '/' + month + '/' + year;

                      postClone.push({ "postId": postId, "userId": userId, "name": "", "text": postText, "date": newDate, "score": postScore, "photoURL": "", "postPhotoURL": postPhotoURL, "commentLength": commentLength, "likes": "", "haveILiked": "" });


                  }
                  
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
      for (let i = 0; i < this.items.length; i++)
          if (this.items[i].postId === postId) {
              console.log("POST FOUND and liked");
              this.items[i].haveILiked = true;
              this.items[i].score++;
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
      for (let i = 0; i < this.items.length; i++)
          if (this.items[i].postId === postId) {
              console.log("POST FOUND and unliked");
              this.items[i].haveILiked = false;
              this.items[i].score--;
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



  showPrompt() {
      let prompt = this.alertCtrl.create({
          title: 'New Post',
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
                      let newPostText = data.text;
                      this.submitPost(newPostText);


                  }
              }
          ]
      });
      prompt.present();

  }

  submitPost(text: string) {
      console.log("the user is : " + this.userId);


      //console.log(firebase.auth().currentUser); FOR WHOLE USER OBJECT

      
      //let userId = "5a749e2e10f95611d82065a9";

      let date = new Date();
      console.log("DATE IS: " + date);

      let post = {
          "userId": this.userId,
          "text": text,
          "date": date,
          "score": 1
      }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/newPost', JSON.stringify(post), { headers: headers })
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

  viewMyProfile()
  {
      this.navCtrl.push(MyProfilePage, {
          "Id": "777"
      });
  }

  viewProfile(userId) {
      console.log("THE PASSED IN ID :" + userId);
      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewProfilePage, {
          userId: userId
      })
  }

  goToSearch() {
      this.navCtrl.push(SearchPage);
  }

  async postPhoto() {

      
      

      try {
          const options: CameraOptions = {
              quality: 50,
              targetWidth: 600,
              targetHeight: 600,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
          }

          const result = await this.camera.getPicture(options);

          const image = 'data:image/jpeg;base64,' + result;

          //
          let date = new Date();
          console.log("DATE IS: " + date);

          let post = {
              "userId": this.userId,
              "text": "",
              "date": date,
              "score": 1,
              "image": image
          }

          let headers = new Headers();
          headers.append('Content-Type', 'application/json');

          this.http.post(URL + '/newPost', JSON.stringify(post), { headers: headers })
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
      catch (e) {
          console.log(e);
      }


  }

  viewPost(userId, postId) {
      
      // this.navCtrl.push(ViewProfilePage);

      this.navCtrl.push(ViewPostPage, {
          userId: userId,
          postId: postId
      })
  }


}
