import { Component, ViewChild, ɵConsole } from '@angular/core';
import { StaticConstatns } from '../staticConstants';
import { Price, PriceList, Recomendations } from '../interfaces';
import { Sanitize, ChartFactory, ChartType } from '../util';
@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  canvas: any;
  ctx: any;
  chartFactory: ChartFactory = new ChartFactory()
  constructor(private _staticConstatns: StaticConstatns) {

  }
  dataset: any[] = [
    {
      contractNo: "", contractSeq: "", startingPoint: "", endPoint: '', qty: ""
    },
  ];
  settings = {
    width: 1900,
    height: 100
  }
  sanitizer = new Sanitize()
  rates: Recomendations[] = [
    {
      armador: ""
      , contractNo: ""
      , contractSeq: ""
      , endPoint: ""
      , pricePerContainer: 0
      , qty: 0
      , startingPoint: ""
      , totalPrice: 0
    }
  ]
  realrates: Recomendations[] = [
    {
      armador: ""
      , contractNo: ""
      , contractSeq: ""
      , endPoint: ""
      , pricePerContainer: 0
      , qty: 0
      , startingPoint: ""
      , totalPrice: 0
    }
  ]
  total = 0
  totalReal = 0
  createRates() {
    this.total = 0
    this.totalReal = 0
    this.createTotal()
    this.rates = []
    this.dataset.sort((n1, n2) => Number(n2.qty) - Number(n1.qty));
    this.dataset.forEach(data => {
      let key = this.sanitizer.createKeys(data.startingPoint.toUpperCase().trim(), data.endPoint.toUpperCase().trim())
      let thisPrice = this._staticConstatns.config.priceList.find(obj => obj.key.toLocaleUpperCase() == key.toLocaleUpperCase())
      let bestPrice = this.findBestPrice(thisPrice, Number(data.qty))
      this._staticConstatns.allocContainerByName(bestPrice.name, Number(data.qty))
      const newItem = Object.assign({}, { data, armador: bestPrice.name, pricePerContainer: bestPrice.value, totalPrice: data.qty * bestPrice.value });
      this.total = this.total + (data.qty * bestPrice.value)
      this.rates.push(Object.assign({}, ...function _flatten(o) { return [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({ [k]: o[k] }))) }(newItem)))
    })
    this.rates.map(item => item.qty = Number(item.qty))
    this.rates.map(item => item.startingPoint = this.sanitizer.sanitizeStrings(item.startingPoint))
    this.createRealRates()
    this.createChart()

  }


  saveAsCSV() {
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(this.rates);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;

    a.download = `recomendacoes.csv`;

    a.click();
  }
  ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ';';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line != '') line += ';';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
  onlyOneShipper(prices) {
    let zeros = 0
    if (0 == prices.CMA_CGM_price.value) {
      zeros++
    }
    if (0 == prices.hamburgSud_price.value) {
      zeros++
    }
    if (0 == prices.MSC_price.value) {
      zeros++
    }
    if (0 == prices.hapagLloyd_price.value) {
      zeros++
    }
    if (0 == prices.maersk_price.value) {
      zeros++
    }
    console.log(zeros == 4);

    return zeros == 4
  }
  returnPrice(prices) {
    if (prices.CMA_CGM_price.value != 0)
      return prices.hamburgSud_price
    if (prices.hamburgSud_price.value != 0)
      return prices.maersk_price
    if (prices.hapagLloyd_price.value != 0)
      return prices.hapagLloyd_price
    if (prices.MSC_price.value != 0)
      return prices.MSC_price
  }
  createRealRates() {
    this.createTotal()
    this.realrates = []
    const singleShippers = []
    this.dataset.sort((n1, n2) => Number(n2.qty) - Number(n1.qty));
    const dataSet_ = [...this.dataset]
    dataSet_.forEach(data => {
      let key = this.sanitizer.createKeys(data.startingPoint.toUpperCase().trim(), data.endPoint.toUpperCase().trim())
      let thisPrice = this._staticConstatns.config.priceList.find(obj => obj.key.toLocaleUpperCase() == key.toLocaleUpperCase())
      if (this.onlyOneShipper(thisPrice)) {
        const singleShipper = this.returnPrice(thisPrice)
        console.log("single", singleShipper)
        this._staticConstatns.allocContainerByName(singleShipper.name, Number(data.qty))
        const newItem = Object.assign({}, { data, armador: singleShipper.name, pricePerContainer: singleShipper.value, totalPrice: data.qty * singleShipper.value });

        this.realrates.push(Object.assign({}, ...function _flatten(o) { return [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({ [k]: o[k] }))) }(newItem)))
        singleShippers.push(data)
      }
    })

    singleShippers.forEach(data => {
      let index = dataSet_.indexOf(data);
      if (index !== -1) {
        dataSet_.splice(index, 1);
      }
    })


    dataSet_.forEach(data => {
      let key = this.sanitizer.createKeys(data.startingPoint.toUpperCase().trim(), data.endPoint.toUpperCase().trim())
      let thisPrice = this._staticConstatns.config.priceList.find(obj => obj.key.toLocaleUpperCase() == key.toLocaleUpperCase())
      let bestPrice = this.findBestRealPrice(thisPrice, Number(data.qty))
      console.log()
      this._staticConstatns.allocContainerByName(bestPrice.name, Number(data.qty))
      const newItem = Object.assign({}, { data, armador: bestPrice.name, pricePerContainer: bestPrice.value, totalPrice: data.qty * bestPrice.value });

      this.realrates.push(Object.assign({}, ...function _flatten(o) { return [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({ [k]: o[k] }))) }(newItem)))
    })
    this.realrates.map(item => item.qty = Number(item.qty))
    this.realrates.forEach(data => this.totalReal =  this.totalReal  + data.totalPrice)
  }

  createTotal() {
    let total = this.dataset.reduce((acc, cur) => acc = acc + Number(cur.qty), 0)
    this._staticConstatns.config.CMA_CGM_qty.value = Math.ceil(total * (this._staticConstatns.config.CMA_CGM_percent / 100))
    this._staticConstatns.config.hapagLloyd_qty.value = Math.ceil(total * (this._staticConstatns.config.hapagLloyd_percent / 100))
    this._staticConstatns.config.hamburgSud_qty.value = Math.ceil(total * (this._staticConstatns.config.hamburgSud_percent / 100))
    this._staticConstatns.config.maersk_qty.value = Math.ceil(total * (this._staticConstatns.config.maersk_percent / 100))
    this._staticConstatns.config.MSC_qty.value = Math.ceil(total * (this._staticConstatns.config.MSC_percent / 100))
  }

  findBestRealPrice(priceList: PriceList, containerQty) {
    let best = { name: "", value: 9999999 }
    for (const key in priceList) {
      if (priceList.hasOwnProperty(key)) {
        const element = priceList[key];
        if (typeof element === 'object') {
          if (element.value != 0) {
            if (this._staticConstatns.getArmadorQtyByName(element.name) >= containerQty) {
              if (element.value < best.value) {
                best = element
              }
            }
          }
        }
      }
    }
    return best
  }

  findBestPrice(priceList: PriceList, containerQty) {
    let best = { name: "", value: 9999999 }
    for (const key in priceList) {
      if (priceList.hasOwnProperty(key)) {
        const element = priceList[key];
        if (typeof element === 'object') {
          if (element.value != 0) {
            if (element.value < best.value) {
              best = element
            }
          }
        }
      }
    }
    return best
  }

  createChart() {
    let hamburgSud = 0, maersk = 0, CMA_CGM = 0, hapagLloyd = 0, MSC = 0, total = 0;
    this.rates.forEach(rate => {
      if (rate.armador == "hamburgSud")
        hamburgSud = rate.qty + hamburgSud
      if (rate.armador == "maersk")
        maersk = rate.qty + maersk
      if (rate.armador == "CMA_CGM")
        CMA_CGM = rate.qty + CMA_CGM
      if (rate.armador == "hapagLloyd")
        hapagLloyd = rate.qty + hapagLloyd
      if (rate.armador == "MSC")
        MSC = rate.qty + MSC
      total = rate.qty + total
    })
    let myChart = this.chartFactory.getChart('armadores', ChartType.Doughnut, [
      "hamburgSud", "maersk", "CMA_CGM", "hapagLloyd", "MSC"
    ], [
        (hamburgSud / total) * 100, (maersk / total) * 100, (CMA_CGM / total) * 100, (hapagLloyd / total) * 100, (MSC / total) * 100
      ])
      console.log(this.total, this.totalReal)
  }

  save() {
    this.rates.map(recom => this._staticConstatns.config.recomendations.push(recom))
    this._staticConstatns.saveToFile()
  }

  deleteRecomendation() {
    this.rates = []
  }

}

