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
import { NotificationsPage } from '../pages/notifications/notifications';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { VideoEditor } from '@ionic-native/video-editor';

import { Config } from 'ionic-angular';
import { ModalScaleUpEnterTransition } from '../scale-up-enter.transition';
import { ModalScaleUpLeaveTransition } from '../scale-up-leave.transition';

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
      ViewPostPage,
      NotificationsPage
      
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
      ViewPostPage,
      NotificationsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
      AuthDataProvider,
      NativeStorage,
      Camera,
      MediaCapture,
      Media,
      StreamingMedia,
      File,
      VideoEditor,
      { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
    constructor(public config: Config) {
        this.setCustomTransitions();
    }

    private setCustomTransitions() {
        this.config.setTransition('modal-scale-up-leave', ModalScaleUpLeaveTransition);
        this.config.setTransition('modal-scale-up-enter', ModalScaleUpEnterTransition);
    }
}
