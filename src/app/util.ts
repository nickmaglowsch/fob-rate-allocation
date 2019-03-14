import * as Chart from 'chart.js';

export class Sanitize {
    constructor() {

    }
    sanitizeStrings(str: string) {
        return str.replace(/\r?\n|\r/g, '').replace(',', '').replace(/\s/g, '').replace('BR', '')
    }
    // createKeys(start, end) {
    //     return `${this.sanitizeStrings(start)}${this.sanitizeStrings(end)}`
    // }
    createKeys(start, end) {
        return `${this.sanitizeStrings(start)}${this.transformLocationInCode(end)}`
    }

    transformLocationInCode(loc) {
        loc = loc.toUpperCase().replace(/\r?\n|\r/g, '').replace(/\s/g, '')
        if (loc == "ANTWERP") return "L037"
        if (loc == "BARCELONA") return "L098"
        if (loc == "VARNA") return "L900"
        if (loc == "THESSALONIKI") return "L900"
        if (loc == "BREMENHOLZHAFEN") return "L902"
        if (loc == "LONDONGATEWAYPORT") return "L904"
        if (loc == "GENOA") return "905"
        if (loc == "GAEVLE") return "L906"
        if (loc == "PIRAEUS") return "L907"
        if (loc == "CASABLANCA") return "l950"
        if (loc == "ST.PETERSBURG") return "L951"
        if (loc == "BANGKOK") return "L953"
        if (loc == "BERGEN") return "L954"
        if (loc == "HAMBURGCY") return "M031"
        return loc
    }
}

export enum ChartType {
    Line = 'line'
    , Bar = 'bar'
    , Radar = 'radar'
    , Doughnut = 'doughnut'
    , Pie = 'pie'
    , PolarArea = 'polarArea'
    , Bubble = 'bubble'
    , Scatter = 'scatter'
}

export class ChartFactory {

    getChart(context, chartType: ChartType, labels, data: any) {
        context = document.getElementById(context)
        context = context.getContext('2d')
        return new Chart(context, this.createOptions(chartType, labels, data))
    }

    destroyChart(context) {
        context = document.getElementById(context)
    }

    private createRandomColorsArray(data) {
        const colors = []
        data.forEach(element => {
            colors.push(this.randomColor(0.7))
        });
        return colors
    }

    randomizeColors(charts: Array<Chart>) {
        charts.forEach(chart => {
            chart.data.datasets[0].backgroundColor = this.createRandomColorsArray(chart.data.datasets[0].data)
            chart.update()
        })
    }

    private randomColor(alpha) {
        return `rgba(${Math.floor(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.floor(Math.random() * 255)},${alpha})`;
    }

    createOptions(chartType, labels, data) {
        return {
            type: chartType,
            data: {
                labels: (() => {
                    if (chartType == ChartType.Line || chartType == ChartType.Line) return [""]
                    else return labels
                })(),
                datasets: [{
                    label: labels,
                    data: data,
                    backgroundColor: this.createRandomColorsArray(data),
                    borderWidth: 1,
                    strokeColor: this.randomColor(1),
                    pointColor: this.randomColor(1),
                    pointStrokeColor: this.randomColor(1),
                    pointHighlightFill: this.randomColor(1),
                    pointHighlightStroke: this.randomColor(1),
                }]
            },
            options: {
                responsive: true,
                display: true,
                hover: {
                    animationDuration: 0
                },
                animation: {
                    duration: 1,
                    onComplete: function () {
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;

                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';

                        this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            });
                        });
                    }
                }
            }
        }
    }
}