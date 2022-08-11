
import Iconsumtion from '../Interfaces/Iconsumption';
import { TresponseConsumtion } from '../types/Tconsume';
import Utils from '../../services/Utils';
import User from './user';
export default class Consumption implements Iconsumtion {
    productId: number|string;
    product:string;
    quantity: number;
    date: Date;
    //private static consumption:Consumption Singgleton no aplica

   private  constructor(productId: number,quantity: number,product:string){
          this.date=new Date();
          this.productId=productId;
          this.quantity=quantity;
          this.product=product
    }

    
   public static initialize(payload?:any){
     if(!payload)return new Consumption(0,0,"")
     const {productId,quantity,product}=payload;
     return new Consumption(productId||0,quantity||0,product||"")
    }
    
    async insert(token:string): Promise<TresponseConsumtion> {
         const query=Utils.insertConsumtionP(),{not_exist,added,objects}=Utils.message(),
          {product,productId,date,quantity}=this;
         try{
             const conn=await Utils.getConSQL()();
             const user=await User.initialize().validateUser(token)
            if(user.error)return {error:true,message:not_exist,data:[],token:null}
             await conn.query(query,[user.id,product,productId,date,quantity])
             return {error:false,message:added(objects.consumtion),data:[],token:user.token}
        }
         catch(error){
           return {error:true,message:<string>error,data:[],token:null}
          }
        
    }


    public async listConsumtion(token:string){
        const query=Utils.listConsumtionP(),{not_exist,added,objects}=Utils.message();
        try{
          const conn=await Utils.getConSQL()();
          const user=await User.initialize().validateUser(token)
           if(user.error)return {error:true,message:not_exist,data:[],token:null}
            const res=await conn.query(query,[user.id])
            return {error:false,message:"",data:res[0],token:user.token}
       }
        catch(error){
          return {error:true,message:<string>error,data:[],token:null}
         }
       

    }
  
}
