export interface PriceList {
    key: string;
    startingPoint: string;
    endPoint: string;
    CMA_CGM_price: Price;
    hamburgSud_price: Price;
    hapagLloyd_price: Price;
    MSC_price: Price;
    maersk_price: Price;
}

export interface Recomendations {
    armador: string
    , contractNo: string
    , contractSeq: string
    , endPoint: string
    , pricePerContainer: number
    , qty: number
    , startingPoint: string
    , totalPrice: number
}

export interface Price {
    name: string;
    value: number;
    rate?: number;
}

export interface Quantity {
    name: string;
    value: number;
}

export interface Config {
    CMA_CGM_percent: number
    MSC_percent: number
    hamburgSud_percent: number
    hapagLloyd_percent: number
    maersk_percent: number
    CMA_CGM_qty: Quantity
    hamburgSud_qty: Quantity
    hapagLloyd_qty: Quantity
    MSC_qty: Quantity
    maersk_qty: Quantity
    priceList: PriceList[]
    recomendations: Recomendations[]
}

export interface Rating {
    position: { name: string, noBestPositon }
}