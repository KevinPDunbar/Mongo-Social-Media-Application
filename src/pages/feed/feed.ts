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

const URL = 'http://192.168.2.108:8000/api';
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
      this.whoAmIFollowing();

      setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
      }, 2000);
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
                      
                      postClone.push({ "postId": postId, "userId": userId, "name": "", "text": postText, "date": newDate, "score": postScore, "photoURL": "", "postPhotoURL": postPhotoURL });


                  }
                  
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
