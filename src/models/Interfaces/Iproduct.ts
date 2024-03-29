import { Tproduct } from '../types/Tproduct';

//import {} from "rxjs"
export type P_response_data={
    error:boolean,message:string,data:Tproduct[],token:string|null
}

export type P_response={
    error:boolean,message:string,data:any,token:string|null
}

export default interface Iproduct{

    product:string	
    category:string	
    createdAt:Date	
    expiryDate:Date	
    total:number	
    quantity:number	
    unit:string	
    price:number
    image?:any

    insert(token:string):Promise<P_response>
    list_expired(token: string): Promise<P_response_data> 
    list_unexpired(token: string): Promise<P_response_data>
}