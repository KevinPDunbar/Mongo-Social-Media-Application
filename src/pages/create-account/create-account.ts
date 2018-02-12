import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the CreateAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {

    firstName: any;
    lastName: any;
    email: any;
    password: any;  

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountPage');
  }
  save(): void {

      let user = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
      };

      this.viewCtrl.dismiss(user);

  }

  close(): void {
      this.viewCtrl.dismiss();
  }


}
