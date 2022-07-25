import { TresponseConsumtion } from '../types/Tconsume';
export default interface Iconsumption{
    productId:number|string
    product:string
    quantity:number
    date:Date
    insert(token:string):Promise<TresponseConsumtion>
}