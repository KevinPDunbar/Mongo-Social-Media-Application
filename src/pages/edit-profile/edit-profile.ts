import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';

import { LoginFormPage } from '../login-form/login-form';
import { NotificationsPage } from '../notifications/notifications';

const URL = 'http://192.168.2.125:8000/api';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

    public posts = [];
    public users = [];
    public unreadNotifications = [];

    userId: any;

    usersName: String;

    public editProfileForm;

    constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, public http: Http, private camera: Camera, public formBuilder: FormBuilder, public AuthDataProvider: AuthDataProvider) {

       

        this.editProfileForm = formBuilder.group({
            firstName: ['', Validators.compose([Validators.required])],
            lastName: ['', Validators.compose([Validators.required])],
            aboutMe: ['', Validators.compose([Validators.required])]
        });

        console.log('ionViewDidLoad MyProfilePage');
        this.nativeStorage.getItem('User')
            .then(
            (data) => {
                if (data !== null) {
                    let id = data.Id;
                    console.log("THE ID IS: " + id);
                    this.userId = id;
                    this.getUser();
                    this.getUnreadCount();
                    //this.getMyPosts();
                }
            }

            )

        
    }

    ionViewDidLoad() {

        
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
                      image = content[i].image;

                      let d = new Date(date);
                      let day = d.getDay();
                      let month = d.getMonth();
                      let year = d.getFullYear();

                      let newDate = day + '/' + month + '/' + year;


                      let name = "test Name";
                      postClone.push({ "postId": postId, "name": this.usersName, "text": text, "date": date, "score": score, "photoURL": "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a", "postPhotoURL": image });
                  }


                  //aboutMe = res.json().aboutMe;


                  //userClone.push({ "id": id, "firstName": firstName, "lastName": lastName, "aboutMe": aboutMe, "photoURL": "https://firebasestorage.googleapis.com/v0/b/login-2aa53.appspot.com/o/anon_user.gif?alt=media&token=723b0c9d-76a6-40ea-ba67-34e058447c0a" })
              }
              else if (!res.json()) {
                  console.log("nothing");
              }

          });

  }

  async takeProfilePicture() {
      

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
          let updatedUser = {
              "id": this.userId,
              "image": image
          }

          let headers = new Headers();
          headers.append('Content-Type', 'application/json');

          this.http.post(URL + '/updateProfilePicture', JSON.stringify(updatedUser), { headers: headers })
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


      
          //

      }
      catch (e) {
          console.log(e);
      }

  }

  updateProfile() {

      

      let firstName = this.editProfileForm.value.firstName;
      let lastName = this.editProfileForm.value.lastName;
      let aboutMe = this.editProfileForm.value.aboutMe;

      console.log("First Name :" + firstName + " Last Name :" + lastName + " About Me: " + aboutMe);

      let updatedUser = {
          "id": this.userId,
          "firstName": firstName,
          "lastName": lastName,
          "aboutMe": aboutMe
      }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/updateProfileInformation', JSON.stringify(updatedUser), { headers: headers })
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

  logOut() {
      this.AuthDataProvider.logoutUser();

      this.navCtrl.setRoot(LoginFormPage);
      
  }
  

}
