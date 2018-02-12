import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';


const URL = 'http://192.168.2.108:8000/api';

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

    public users = [];
    public posts = [];
    public comments = [];

    public passedUserId;
    public passedPostId;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController) {

        this.passedUserId = navParams.get("userId");
        console.log("PASSED USER ID : " + this.passedUserId);
        this.passedPostId = navParams.get("postId");
        console.log("PASSED POST ID :" + this.passedPostId);
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ViewPostPage');
      this.getPost();
      //this.addComment();
      this.whoAmIFollowing();
      this.getComments();
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
                  
                  let userId
                  let commentId;
                  let commentText;
                  let commentDate;

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
                                  

                                  commentsClone.push({ "name": posterName, "text": commentText, "photoURL": posterPhotoUrl, "date": newDate });

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

                                  userClone.push({ "postId": postId, "userId": userId, "name": posterName, "text": postText, "date": newDate, "score": postScore, "photoURL": posterPhotoUrl, "postPhotoURL": postPhotoURL });

                                  //postClone.name = posterName;
                                  //postClone.photoURL = posterPhotoUrl;

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

      let date = new Date();

      let comment = { "userId": userId, "postId": postId, "date": date, "text": newCommentText };

      

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(URL + '/newComment', JSON.stringify(comment), { headers: headers })
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
