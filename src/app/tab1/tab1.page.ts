import { Component } from '@angular/core';
import { StaticConstatns } from '../staticConstants';
import { PriceList } from '../interfaces';
import { Sanitize } from '../util'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private _staticConstatns: StaticConstatns, private alertCtrl: AlertController) {
    this.CMA_CGM_qty = _staticConstatns.config.CMA_CGM_percent
    this.hamburgSud_qty = _staticConstatns.config.hamburgSud_percent
    this.hapagLloyd_qty = _staticConstatns.config.hapagLloyd_percent
    this.MSC_qty = _staticConstatns.config.MSC_percent
    this.maersk_qty = _staticConstatns.config.maersk_percent
    this.createTable(_staticConstatns.config.priceList)
    console.log(
      this.CMA_CGM_qty,
      this.hamburgSud_qty,
      this.hapagLloyd_qty,
      this.MSC_qty,
      this.maersk_qty
    )
  }

  ionviewwillenter() {
    this.CMA_CGM_qty = this._staticConstatns.config.CMA_CGM_percent
    this.hamburgSud_qty = this._staticConstatns.config.hamburgSud_percent
    this.hapagLloyd_qty = this._staticConstatns.config.hapagLloyd_percent
    this.MSC_qty = this._staticConstatns.config.MSC_percent
    this.maersk_qty = this._staticConstatns.config.maersk_percent
    this.createTable(this._staticConstatns.config.priceList)
    console.log(
      this.CMA_CGM_qty,
      this.hamburgSud_qty,
      this.hapagLloyd_qty,
      this.MSC_qty,
      this.maersk_qty
    )
  }

  CMA_CGM_qty: Number
  hamburgSud_qty: Number
  hapagLloyd_qty: Number
  MSC_qty: Number
  maersk_qty: Number
  sanitizer = new Sanitize()
  prices: [hackyPrice] = [{
    key: "",
    startingPoint: "",
    endPoint: "",
    CMA_CGM_price: "",
    hamburgSud_price: '',
    hapagLloyd_price: '',
    MSC_price: '',
    maersk_price: ''
  }]
  settings = {
    width: 1700,
    height: 300
  }

  createTable(priceList) {
    priceList.forEach(price => {
      this.prices.push({
        key: price.key,
        startingPoint: price.startingPoint,
        endPoint: price.endPoint,
        CMA_CGM_price: price.CMA_CGM_price.value,
        hamburgSud_price: price.hamburgSud_price.value,
        hapagLloyd_price: price.hapagLloyd_price.value,
        MSC_price: price.MSC_price.value,
        maersk_price: price.maersk_price.value
      })
    });
  }

  save() {
    debugger;
    this._staticConstatns.config.CMA_CGM_percent = Number(this.CMA_CGM_qty)
    this._staticConstatns.config.hamburgSud_percent = Number(this.hamburgSud_qty)
    this._staticConstatns.config.hapagLloyd_percent = Number(this.hapagLloyd_qty)
    this._staticConstatns.config.MSC_percent = Number(this.MSC_qty)
    this._staticConstatns.config.maersk_percent = Number(this.maersk_qty)
    this._staticConstatns.config.priceList = this.convertTableToPriceList()
    this._staticConstatns.saveToFile()
  }

  async ConfirmSave() {
    const alert = await this.alertCtrl.create({
      header: 'Salvar?',
      message: 'Realmente deseja Salvar os preços?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.save()
          }
        }
      ]
    });
    alert.present()
  }

  normalizeStrings(str: string) {
    str = this.sanitizer.sanitizeStrings(str)
    str = str.replace("BR", "")
    if (str[str.length - 1] == ")") {
      str = str.substring(0, str.indexOf("("))
    }
    return str.trim()
  }

  convertTableToPriceList() {
    let priceListTyped = new Array<PriceList>();
    this.prices.forEach(element => {
      debugger;
      element.key = this.sanitizer.createKeys(element.startingPoint, element.endPoint)
      element.startingPoint = this.sanitizer.sanitizeStrings(element.startingPoint)
      element.endPoint = this.sanitizer.sanitizeStrings(element.endPoint)
      element.CMA_CGM_price = { name: "CMA_CGM", value: Number(element.CMA_CGM_price) }
      element.hamburgSud_price = { name: "hamburgSud", value: Number(element.hamburgSud_price) }
      element.hapagLloyd_price = { name: "hapagLloyd", value: Number(element.hapagLloyd_price) }
      element.MSC_price = { name: "MSC", value: Number(element.MSC_price) }
      element.maersk_price = { name: "maersk", value: Number(element.maersk_price) }
      if (element.key != "") {
        priceListTyped.push(element)
      }
    });
    return priceListTyped
  }
}

interface hackyPrice {
  key: string;
  startingPoint: string;
  endPoint: string;
  CMA_CGM_price: any
  hamburgSud_price: any
  hapagLloyd_price: any
  MSC_price: any
  maersk_price: any
}
