import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { HttpModule } from '@angular/http';
 
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { LoginFormPage } from '../pages/login-form/login-form';
import { SignupPage } from '../pages/signup/signup';
import { FeedPage } from '../pages/feed/feed';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { ViewProfilePage } from '../pages/view-profile/view-profile';
import { SearchPage } from '../pages/search/search';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ViewPostPage } from '../pages/view-post/view-post';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';


@NgModule({
  declarations: [
    MyApp,
      HomePage,
      CreateAccountPage,
      LoginFormPage,
      SignupPage,
      FeedPage,
      MyProfilePage,
      ViewProfilePage,
      SearchPage,
      EditProfilePage,
      ViewPostPage
      
  ],
  imports: [
      BrowserModule,
      HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
      HomePage,
      CreateAccountPage,
      LoginFormPage,
      SignupPage,
      FeedPage,
      MyProfilePage,
      ViewProfilePage,
      SearchPage,
      EditProfilePage,
      ViewPostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
      AuthDataProvider,
      NativeStorage,
      Camera,
      { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
