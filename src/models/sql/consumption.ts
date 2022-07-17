
import Iconsumtion from '../Interfaces/Iconsumption';
import { TresponseConsumtion } from '../types/Tconsume';
import Utils from '../../services/Utils';
import SessionManageR from '../../services/session/token_manager';
import User from './user';

export default class Consumption implements Iconsumtion {
    product: number;
    quantity: number;
    date: Date;

    constructor(product: number,quantity: number){
          this.date=new Date();
          this.product=product;
          this.quantity=quantity;
    }

    async insert(token:string): Promise<TresponseConsumtion> {
         const conn=await Utils.getConSQL()(),query=Utils.insertConsumtionP(),{not_exist,added,objects}=Utils.message();
         try{
            const {id,name,email}=await SessionManageR.decodToken(token),
            {error,message}= await User.getUser(id,name,email),{product,date,quantity}=this;
            if(error)return {error:true,message:not_exist,data:[]}
             await conn.query(query,[id,product,date,quantity])
             return {error:false,message:added(objects.consumtion),data:[]}
        }
         catch(error){
           return {error:true,message:<string>error,data:[]}
          }
        
    }


    public static async listConsumtion(token:string){
        const conn=await Utils.getConSQL()(),query=Utils.listConsumtionP(),{not_exist,added,objects}=Utils.message();
        try{
           const {id,name,email}=await SessionManageR.decodToken(token),
           {error}= await User.getUser(id,name,email);
           if(error)return {error:true,message:not_exist,data:[]}
            const res=await conn.query(query,[id])
            return {error:false,message:"",data:res[0]}
       }
        catch(error){
          return {error:true,message:<string>error,data:[]}
         }
       

    }
  
}
