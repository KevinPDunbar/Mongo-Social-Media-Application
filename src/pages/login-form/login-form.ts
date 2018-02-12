import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams, LoadingController,
    AlertController
} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { EmailValidator } from '../../validators/email';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';

import { SignupPage } from '../signup/signup';
import { FeedPage } from '../feed/feed';
/**
 * Generated class for the LoginFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-form',
  templateUrl: 'login-form.html',
})
export class LoginFormPage {

    public loginForm;
    loading: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController,
        public nav: NavController, public AuthDataProvider: AuthDataProvider) {

        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginFormPage');
  }

  goToSignup() {
      this.navCtrl.push(SignupPage);
  }

  loginUser(): void {
      if (!this.loginForm.valid) {
          console.log(this.loginForm.value);
      } else {

          this.AuthDataProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password);
          this.navCtrl.push(FeedPage);
      }
  }

}
