import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams, LoadingController,
    AlertController
} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { EmailValidator } from '../../validators/email';

import { LoginFormPage } from '../login-form/login-form';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

    public signupForm;
    loading: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public AuthDataProvider: AuthDataProvider,
        public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
        public alertCtrl: AlertController) {

        this.signupForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            firstName: ['', Validators.compose([Validators.minLength(1), Validators.required])],
            lastName: ['', Validators.compose([Validators.minLength(1), Validators.required])]
        })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signupUser() {
      if (!this.signupForm.valid) {
          console.log(this.signupForm.value);
      } else {
          this.AuthDataProvider.createUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.firstName, this.signupForm.value.lastName);

          this.loading = this.loadingCtrl.create();
          this.loading.present();
          this.navCtrl.push(LoginFormPage);
          this.loading.dismiss();

          
      }
  }

}
