import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';

import { EditProfilePage } from '../edit-profile/edit-profile';

const URL = 'http://192.168.2.108:8000/api';

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
              }
          }
        
          )
  }

  editProfile()
  {
      this.navCtrl.push(EditProfilePage);
  }

  Refresh(refresher) {
      console.log('Begin async operation');
      this.posts = [];
      this.users = [];
      this.getUser();
      this.getMyPosts();

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


                      let name = "test Name";
                      postClone.push({ "postId": postId, "name": this.usersName, "text": text, "date": date, "score": score, "photoURL": this.usersPhoto, "postPhotoURL": image });
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

}
