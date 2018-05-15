import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

/*
  Generated class for the DashboardAdvertisingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HomeService {

    constructor(private http: Http,
        private tts: TextToSpeech,
        private speechRecognition: SpeechRecognition,
    ) { }

    textToSpeech(text) {
        var op = {
            text: text,
            locale: 'vi-VN',
            rate: 1
        }
        return this.tts.speak(op);
    }

    startListening() {
        let options = {
            language: 'vi-VN'
        }
        this.speechRecognition.startListening(options).subscribe(matches => {
            if (matches)
                this.textToSpeech(matches[0]);
            console.log('start-', matches);
        });
    }

    public b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);

            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    public uploadBlob(file, params: object, type?: string, options?: any) {
        const formData: FormData = new FormData();
        formData.append('image', file);
        // formData.append('file', file, file.name);
        return this.upload(localStorage.getItem('id_server'), formData);
    }

    uploadListBlob(listFile) {
        const formData: FormData = new FormData();
        for (let i = 0; i < listFile.length; i++) {
            formData.append('image' + (i + 1), listFile[i]);
        }
        // formData.append('image', file, file.name);
        // formData.append('file', file, file.name);

        return this.upload(localStorage.getItem('id_server_2'), formData);
    }

    upload(url, formData) {
        var host = 'http://' + url;
        // const headers = new Headers();
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Accept', 'application/json');
        // const body = JSON.stringify({ headers: headers });
        // return this.http.post('http://192.168.1.14:8000/polls/process', formData);
        return this.http.post(host, formData);
    }

    changeImage(event) {
        var file = event.target.files[0];
        console.log(file);
        const formData: FormData = new FormData();
        formData.append('image', file, file.name);
        return this.upload('', formData);
    }
}
