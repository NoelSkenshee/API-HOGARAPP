import { TresponseExpiry } from "../types/Texpiry";
import { Tproduct } from '../types/Tproduct';

export default  interface Iexpiry {
    product:Tproduct,
	destination:string,
    date:Date,
	quantity:number,
    throw(token:string):Promise<TresponseExpiry>;
    donate(token:string,):Promise<TresponseExpiry>;
    listDonations(token:string):Promise<TresponseExpiry>;
}