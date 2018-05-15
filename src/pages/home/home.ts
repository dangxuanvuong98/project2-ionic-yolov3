import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HomeService } from './home.service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private device: any;
  @ViewChild('video') video: ElementRef;
  private constraints: any = {
    audio: false,
    video: false
  };
  imageBlob: any;
  number_for_camera = 0;;
  statusAuto = false;
  checkCordova;
  matches;
  isRecording;
  groupImage = [];
  private isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
  constructor(public navCtrl: NavController,
    private platform: Platform,
    private service: HomeService, ) {
    this.device = {
      audioInputSelect: [],
      audioOutputSelect: [],
      videoSelect: []
    }
  }

  ionViewDidLoad() {
    if (this.platform.is('cordova')) {
      this.checkCordova = true;
    } else {
      this.checkCordova = false;
    }
    // this.getPermissionCamera();
    this.getListPermission();
  }

  changeCam() {
    this.number_for_camera++;
    if (this.number_for_camera == this.device.videoSelect.length) {
      this.number_for_camera = 0;
    }
    this.constraints.video = this.device.videoSelect[this.number_for_camera].deviceId;
    console.log(this.device.videoSelect[this.number_for_camera].deviceId);
    this.getVideo();
    if (this.checkCordova) {
      this.service.textToSpeech("chuyển camera thành công")
        .then(() => {
          // this.processCapture();
        })
        .catch((reason: any) => console.log(reason));
    }
  }

  changeStatus() {
    console.log("22222222222");
    this.groupImage = [];
    this.statusAuto = !this.statusAuto;
    var text;
    if (this.statusAuto) {
      text = "bạn đang ở trạng thái tự động"
    } else {
      text = "bạn đang ở trạng thái thủ công"
    }
    if (this.checkCordova) {
      this.service.textToSpeech(text)
        .then(() => {
          if (this.statusAuto)
            this.processCapture();
        })
        .catch((reason: any) => console.log(reason));
    }
  }

  getListPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    let self = this;
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          let option: any = {};
          option = device;
          if (device.kind === 'audioinput') {
            option.text = device.label ||
              'Microphone ' + (self.device.audioInputSelect.length + 1);
            self.device.audioInputSelect.push(option);
          } else if (device.kind === 'audiooutput') {
            option.text = device.label || 'Speaker ' +
              (self.device.audioOutputSelect.length + 1);
            self.device.audioOutputSelect.push(option);
          } else if (device.kind === 'videoinput') {
            option.text = device.label || 'Camera ' +
              (self.device.videoSelect.length + 1);
            self.device.videoSelect.push(option);
          }
        });
        console.log("getListPermission", self.device);

        // self.constraints.audio = self.device.audioInputSelect[0].deviceId;
        self.constraints.video = self.device.videoSelect[0].deviceId;
        self.userMedia(self.constraints);
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });

  }

  getAudio() {
    setTimeout(() => {
      var audio_device = this.constraints.audio;
      this.constraints.audio = typeof audio_device === 'boolean' ? audio_device : {
        deviceId: this.isFirefox ? audio_device : { exact: audio_device }
      }
      this.userMedia(this.constraints);
    }, 100);
  }

  getVideo() {
    setTimeout(() => {
      var video_device = this.constraints.video;
      this.constraints.video = typeof video_device === 'boolean' ? video_device : {
        deviceId: this.isFirefox ? video_device : { exact: video_device }
      }
      this.userMedia(this.constraints);
    }, 100);
  }

  userMedia(constraints) {
    // let self = this;
    console.log("media", constraints);
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      var video = document.querySelector('video');
      video.srcObject = stream;
      this.video.nativeElement.srcObject = stream;
      video.onloadedmetadata = function (e) {
        video.play();
        // self.processCapture();
      };
    }).catch(err => {
      console.log("err", err);
    });
  }

  processCapture() {
    // this.video.nativeElement.pause();
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
    var context: CanvasRenderingContext2D = canvas.getContext("2d");
    var video_width = this.video.nativeElement.videoWidth;
    var video_height = this.video.nativeElement.videoHeight;

    if (video_width / video_height == 4 / 3) {
      video_width = 640;
      video_height = 480;
    } else if (video_width / video_height == 3 / 4) { //mobile, tablet
      video_width = 360;
      video_height = 480;
    }

    canvas.width = video_width;
    canvas.height = video_height;

    context.drawImage(this.video.nativeElement, canvas.width / 2 - video_width / 2, canvas.height / 2 - video_height / 2, video_width, video_height);
    var pngUrl = canvas.toDataURL("image/jpeg", 1.0);
    var dataImage = pngUrl.substring(23, pngUrl.length);
    this.imageBlob = this.service.b64toBlob(dataImage, 'image/jpeg', null);

    this.imageBlob = new File([this.imageBlob], "profile.jpeg");
    console.log("trong", this.statusAuto);
    if (this.statusAuto) {
      this.callApi();
    } else {
      this.takeDistance();
    }
  }

  takeDistance() {
    if (this.checkCordova) {
      var text;
      this.groupImage.push(this.imageBlob);

      if (this.groupImage.length == 1) {
        text = "chụp bức ảnh đầu tiên thành công, bạn vui lòng chụp bức ảnh thứ hai";
      } else if (this.groupImage.length == 2) {
        text = "chụp bức ảnh thứ hai thành công";
      }
      this.service.textToSpeech(text)
        .then(() => {
          if (this.groupImage.length == 2) {
            this.service.uploadListBlob(this.groupImage).subscribe((data: any) => {
              // var text = data._body;
              this.service.textToSpeech(data._body)
                .then(() => {
                  this.groupImage = [];
                  // if (this.statusAuto)
                  // this.processCapture();
                })
                .catch((reason: any) => {
                  this.groupImage = [];
                  console.log(reason)
                });
            }, err => {
              console.log("err", err);
              this.groupImage = [];
            })
          }
          // this.processCapture();
        })
        .catch((reason: any) => {
          this.groupImage = [];
          console.log(reason)
        });
    }
  }

  callApi() {
    this.service.uploadBlob(this.imageBlob, null).subscribe((data: any) => {
      var text = data._body;
      console.log(text);
      if (this.checkCordova) {
        this.service.textToSpeech(text)
          .then(() => {
            if (this.statusAuto)
              this.processCapture();
          })
          .catch((reason: any) => console.log(reason));
      }
    }, err => {
      console.log(err);
    });
  }

  changeImage(event) {
    this.service.changeImage(event).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })
  }
}
