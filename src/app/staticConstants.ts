import { Config, Recomendations } from "./interfaces";
import { ElectronService } from 'ngx-electron';
import { Injectable } from "@angular/core";


@Injectable()
export class StaticConstatns {

    fs
    constructor(private _electronService: ElectronService) {
        this.fs = _electronService.remote.require('fs');
        if (localStorage.getItem("StaticConstatns")) {
            this.config = JSON.parse(localStorage.getItem("StaticConstatns"))
        }

    }

    public config: Config
        = {
            CMA_CGM_percent: 0,
            MSC_percent: 0,
            hamburgSud_percent: 0,
            hapagLloyd_percent: 0,
            maersk_percent: 0,
            CMA_CGM_qty: { name: "CMA_CGM", value: 0 },
            MSC_qty: { name: "MSC", value: 0 },
            hamburgSud_qty: { name: "hamburgSud", value: 0 },
            hapagLloyd_qty: { name: "hapagLloyd", value: 0 },
            maersk_qty: { name: "maersk", value: 0 },
            priceList: [],
            recomendations: []
        }

    public allocContainerByName(armadorName, containersToAlloc) {
        
        switch (armadorName) {
            case "CMA_CGM":
                this.config.CMA_CGM_qty.value = this.config.CMA_CGM_qty.value - containersToAlloc;
                break;
            case "MSC":
                this.config.MSC_qty.value = this.config.MSC_qty.value - containersToAlloc;
                break;
            case "hamburgSud":
                this.config.hamburgSud_qty.value = this.config.hamburgSud_qty.value - containersToAlloc;
                break;
            case "hapagLloyd":
                this.config.hapagLloyd_qty.value = this.config.hapagLloyd_qty.value - containersToAlloc;
                break;
            case "maersk":
                this.config.maersk_qty.value = this.config.maersk_qty.value - containersToAlloc;
                break;
        }
    }

    public getArmadorQtyByName(armadorName) {

        switch (armadorName) {
            case "CMA_CGM":
                return this.config.CMA_CGM_qty.value
            case "MSC":
                return this.config.MSC_qty.value
            case "hamburgSud":
                return this.config.hamburgSud_qty.value
            case "hapagLloyd":
                return this.config.hapagLloyd_qty.value
            case "maersk":
                return this.config.maersk_qty.value
            default:
                return "invalid name"
        }


    }

    public saveToFile(): any {
        console.log("saving...")
        // localStorage.setItem("StaticConstatns", JSON.stringify(this.config))
        this.fs.writeFile("./options.json", JSON.stringify(this.config), function (err) {
            if (err) { alert("erro no arquivo"); return }
        })
    }

    public resetLocalStorage() {
        console.log("resetting")
        localStorage.setItem("StaticConstatns", JSON.stringify(this.config))
    }


}