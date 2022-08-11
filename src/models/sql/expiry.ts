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


    private constructor(product:Tproduct,destination:string,	quantity:number){
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
         const user=await User.initialize().validateUser(token);
         if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
         await conn.query(query,[user.id,product.id,product.product, destination,date,new Date(expiryDate),quantity,unit,image])
         return {error:user.error,message:added(objects.donation),data:null,token:user.token}
         } catch (error) {
         return {error:true,message:<string>error,data:null,token:null}
         }
    }



   async listDonations(token: string): Promise<TresponseExpiry> {
        const query=Utils.listDonationsP();
        try {
        const conn=await Utils.getConSQL()();
        const user=await User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        const res=await conn.query(query,[user.id])
        return {error:user.error,message:"",data:res[0],token:user.token}
        } catch (error) {
        return {error:true,message:<string>error,data:null,token:null}
        }
    }


   async throw(token: string): Promise<TresponseExpiry> {
       const query=Utils.trashP();;
        try {
        const conn=await Utils.getConSQL()();
        const {trash}=Utils.message()
        const user=await  User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        await conn.query(query,[user.id,this.product.id])
        return {error:user.error,message:trash,data:null,token:user.token};
        } catch (error) {
        return {error:true,message:<string>error,data:null,token:null}
        }

    }


}