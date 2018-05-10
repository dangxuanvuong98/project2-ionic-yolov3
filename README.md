1 - cài đặt nodejs.
2 - cài đặt ionic 
3 - Sử dụng Android Permissions để xin quyền camera android
    cài đặt : 
    -   ionic cordova plugin add cordova-plugin-android-permissions
    -   npm install --save @ionic-native/android-permissions
4 - Sử dụng Text To Speech để xin quyền mic và sử dụng tự động đọc text.
    cài đặt :
    -   ionic cordova plugin add cordova-plugin-tts
    -    npm install --save @ionic-native/text-to-speech
5 - Sử dụng 
    -   ionic cordova prepare android
    để build app ionic -> android.
6 - Sử dủng dụng Android Studio để build app ra điện thoại.