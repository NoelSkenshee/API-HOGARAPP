import { TresponseConsumtion } from '../types/Tconsume';
export default interface Iconsumption{
    product:number
    quantity:number
    date:Date
    insert(token:string):Promise<TresponseConsumtion>
}