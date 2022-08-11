import { Tquery_response } from '../types/Tqueries';
export  interface  Iqueries{
     token:string
     product:string
     date:Date
     remaining():Promise<Tquery_response>
     diferenceDate(init:Date,end:Date):number
     wast(quantity:number,expiryDate:Date):Promise<Tquery_response>
     consumptionDays(quantity:number):Promise<Tquery_response>
     recomendation(expiryDate:Date):Promise<Tquery_response>
}