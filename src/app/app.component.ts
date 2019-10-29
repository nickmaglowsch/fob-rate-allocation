import { Component } from '@angular/core';
// import { ElectronService } from 'ngx-electron';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StaticConstatns } from './staticConstants';
import { FIREBASE_CONFIG } from './prod'
import * as firebase from 'firebase'
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  ref
  constructor (private _staticConstatns: StaticConstatns) {
    firebase.initializeApp(FIREBASE_CONFIG)
    this.initializeApp();
  }

  initializeApp() {
    localStorage.clear()
    this.ref = firebase.database().ref('config/')
    // firebase base ref LrHISHPUwWBlBAkPrQE
    this.ref.once('value').then(data => {
      let json = data.val()['-LrHISHPUwWBlBAkPrQE']
      localStorage.setItem("StaticConstatns", JSON.stringify(json))
      this._staticConstatns.config = json
    })
    // const fs = this._electronService.remote.require('fs');
    // fs.readFile("./options.json", { encoding: 'utf-8' }, function (err, data) {
    //   if (err) fs.open("./options.json", "w", function (err) { if (err) { alert("erro no arquivo"); return } })
    //   const json = JSON.parse(data);
    //   console.log("veio do arquivo", json)
    //   localStorage.setItem("StaticConstatns", JSON.stringify(json))
    //   // if (json) {
    //   //   this._staticConstatns.config = json
    //   //   console.log("configurado do arquvio",this._staticConstatns.config )
    //   // }
    // })

  }
}
