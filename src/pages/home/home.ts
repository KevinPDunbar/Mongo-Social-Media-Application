import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CreateAccountPage } from '../create-account/create-account';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { LoginFormPage } from '../login-form/login-form';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    users: any;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public AuthDataProvider: AuthDataProvider) {

    }

    ionViewDidLoad() {

        this.AuthDataProvider.getUsers().then((data) => {
            console.log(data);
            this.users = data;
        });

    }

    goToLoginForm()
    {
        this.navCtrl.push(LoginFormPage);
    }



    deleteUser(user) {

        //Remove locally
        let index = this.users.indexOf(user);

        if (index > -1) {
            this.users.splice(index, 1);
        }

        //Remove from database
        this.AuthDataProvider.deleteUser(user._id);
    }


}
