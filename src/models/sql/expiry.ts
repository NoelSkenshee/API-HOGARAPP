import Iexpiry from '../Interfaces/Iexpiry';
import { TresponseExpiry } from '../types/Texpiry';
import Utils from '../../services/Utils';
import User from './user';
import { Tproduct } from '../types/Tproduct';
export default class Expiry implements Iexpiry{

    product:Tproduct;
    destination: string;
    date: Date;
    quantity: number;
    public static instance:Expiry;

    public constructor(product:Tproduct,destination:string,	quantity:number){
       this.product=product
       this.destination=destination
       this.date=new Date()
       this.quantity=quantity
    }
 
   public static initialize(payload?:any){
    let prod:any={}
    if(!payload)return new Expiry(prod,"",0);
    const {product,destination}=payload;
     return new Expiry(<Tproduct>product,destination,0)
   }

  
   async  donate(token: string): Promise<TresponseExpiry> {
        const {product,destination,date,quantity}=this,query=Utils.donateP(),{unit,image,expiryDate}=product;
         try {
         const conn=await Utils.getConSQL()();
         const {added,objects}=Utils.message()
         const {error,message,id}=await User.initialize().validateUser(token);
         if(error)return {error,message,data:null};
         await conn.query(query,[id,product.id,product.product, destination,date,new Date(expiryDate),quantity,unit,image])
         return {error,message:added(objects.donation),data:null}
         } catch (error) {
         return {error:true,message:<string>error,data:null}
         }
    }



   async listDonations(token: string): Promise<TresponseExpiry> {
        const query=Utils.listDonationsP();
        try {
        const conn=await Utils.getConSQL()();
        const {error,message,id}=await User.initialize().validateUser(token);
        if(error)return {error,message,data:null};
        const res=await conn.query(query,[id])
        return {error,message:"",data:res[0]}
        } catch (error) {
        return {error:true,message:<string>error,data:null}
        }
    }


   async throw(token: string): Promise<TresponseExpiry> {
       const query=Utils.trashP();;
        try {
        const conn=await Utils.getConSQL()();
        const {trash}=Utils.message()
        const {error,message,id}=await  User.initialize().validateUser(token);
        if(error)return {error,message,data:null};
        await conn.query(query,[id,this.product.id])
        return {error,message:trash,data:null}
        } catch (error) {
        return {error:true,message:<string>error,data:null}
        }

    }


}