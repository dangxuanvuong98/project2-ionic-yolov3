import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private speechRecognition: SpeechRecognition,
    private androidPermissions: AndroidPermissions) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Setting', component: ListPage }
    ];

  }

  initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        this.getPermission();
      }
    });

  }

  getPermission() {
    this.getPermissionMic();
    this.getPermissionCamera();
  }

  getPermissionMic() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        console.log("check", hasPermission)
        if (!hasPermission)
          this.speechRecognition.requestPermission()
            .then(
              () => console.log('Granted'),
              () => console.log('Denied')
            )
      });
  }

  getPermissionCamera() {
    // this.androidPermissions.requestPermissions(
    //   [
    //     this.androidPermissions.PERMISSION.CAMERA,
    //     this.androidPermissions.PERMISSION.GET_ACCOUNTS
    //   ]
    // ).then((success) => {
    // }, err => {
    //   console.log("----------3", err);
    // })
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => {
        console.log("permission", result);
        if (!result.hasPermission)
          this.androidPermissions.requestPermissions(
            [
              this.androidPermissions.PERMISSION.CAMERA,
              this.androidPermissions.PERMISSION.GET_ACCOUNTS
            ]
          ).then((success) => {
          }, err => {
            console.log("----------3", err);
          })
      },
      err =>
        this.androidPermissions.requestPermissions(
          [
            this.androidPermissions.PERMISSION.CAMERA,
            this.androidPermissions.PERMISSION.GET_ACCOUNTS
          ]
        ).then((success) => {
        }, err => {
          console.log("----------3", err);
        })
    );
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
