import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  id_server;
  items: Array<{ title: string, note: string, icon: string }>;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    this.getID();
  }

  itemTapped(event, item) {
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.getID();
          }
        },
        {
          text: 'Done',
          handler: () => {
            this.setID(this.id_server);
          }
        }
      ]
    });
    alert.present();
  }

  getID() {
    this.id_server = localStorage.getItem('id_server');
  }

  setID(id) {
    localStorage.setItem("id_server", id)
  }
}
