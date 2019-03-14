import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ChartFactory, ChartType } from '../util';
import { Recomendations } from '../interfaces';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements AfterViewInit {


  selectOptions = {
    title: 'Tipo do Gráfico',
    subTitle: 'Escolha o tipo do gráfico',
    mode: 'md'
  };
  gfxType:any;
  keys: any[];
  canvas: any;
  ctx: any;
  chartFactory: ChartFactory = new ChartFactory()
  charts = new Array<Chart>()
  priceList = []
  usedRecomendations: Array<Recomendations> = []

  constructor() {
    this.gfxType = ChartType.Bar
  }


  ionViewDidEnter() {
    this.priceList = JSON.parse(localStorage.getItem('StaticConstatns')).priceList
      .filter(a => a.CMA_CGM_price.value != 0 ||
        a.hamburgSud_price.value != 0 ||
        a.MSC_price.value != 0 ||
        a.maersk_price.value != 0 ||
        a.hapagLloyd_price.value != 0)
    this.usedRecomendations = JSON.parse(localStorage.getItem('StaticConstatns')).recomendations
    console.log({ price: this.priceList, recomendations: this.usedRecomendations })
    this.ngAfterViewInit()
  }

  clearCharts(){
    this.charts.forEach((chart) => chart.destroy())
  }

  ngAfterViewInit(): void {
    
    if(this.charts){
      this.clearCharts()
    }
    
    const usedRecomendations = [...this.usedRecomendations]

    const priceList = [...this.priceList]

    console.log(usedRecomendations.map(item => item.armador))
    let totals = usedRecomendations.reduce(function (accumulator, currentItem, currentIndex) {
      // look up if the current item is of a category that is already in our end result.
      let index = accumulator.findIndex((item) => item.armador === currentItem.armador)
      if (index < 0) {
        accumulator.push(currentItem); // now item added to the array
      } else {
        accumulator[index].qty += currentItem.qty // update the sum of already existing item
      }
      return accumulator;
    }, [])
    let myChart = this.chartFactory.getChart('total', this.gfxType, totals.map(item => item.armador), totals.map(item => item.qty))
    this.charts.push(myChart)
    myChart = this.chartFactory.getChart('CMA_CGM_prices', this.gfxType, this.priceList.filter(item => item.CMA_CGM_price.value != 0).map(item => item.key), priceList.filter(item => item.CMA_CGM_price.value != 0).map(item => item.CMA_CGM_price.value))
    this.charts.push(myChart)
    myChart = this.chartFactory.getChart('MSC_prices', this.gfxType, priceList.filter(item => item.MSC_price.value != 0).map(item => item.key), priceList.filter(item => item.MSC_price.value != 0).map(item => item.MSC_price.value))
    this.charts.push(myChart)
    console.log(priceList.filter(item => item.hamburgSud_price.value != 0).map(item => item.hamburgSud_price.value))
    myChart = this.chartFactory.getChart('hamburgSud_prices', this.gfxType, priceList.filter(item => item.hamburgSud_price.value != 0).map(item => item.key), priceList.filter(item => item.hamburgSud_price.value != 0).map(item => item.hamburgSud_price.value))
    this.charts.push(myChart)
    myChart = this.chartFactory.getChart('hapagLloyd_prices', this.gfxType, priceList.filter(item => item.hapagLloyd_price.value != 0).map(item => item.key), priceList.filter(item => item.hapagLloyd_price.value != 0).map(item => item.hapagLloyd_price.value))
    this.charts.push(myChart)
    myChart = this.chartFactory.getChart('maersk_prices', this.gfxType, priceList.filter(item => item.hapagLloyd_price.value != 0).map(item => item.key), priceList.filter(item => item.maersk_price.value != 0).map(item => item.maersk_price.value))
    this.charts.push(myChart)
  }


  randomizeColors() {
    this.charts.forEach(chart => {
      console.log(chart.data)
    })
    this.chartFactory.randomizeColors(this.charts)
  }



}
