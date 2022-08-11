import Iexpiry from '../Interfaces/Iexpiry';
import { TresponseExpiry } from '../types/Texpiry';
import Utils from '../../services/Utils';
import User from './user';
import { modelExpiry, ExpiryModel } from './schema/expiry';
import ProductMongo from './product';
import { Tproduct } from '../types/Tproduct';
import { ProductModel } from './schema/product';
export default class ExpiryMONGO implements Iexpiry{
    product: Tproduct;
    destination: string;
    date: Date;
    quantity: number;
    public constructor(product:Tproduct,destination:string,	quantity:number){
       this.product=product
       this.destination=destination
       this.date=new Date()
       this.quantity=quantity
    }
 
   public static initialize(payload?:any){
          let product_:any={ };
          if(!payload)return new ExpiryMONGO(product_,"",0)
          const {product,destination,date,quantity}=payload;
          return new ExpiryMONGO(<Tproduct>product,destination,quantity)
        }


  
   async  donate(token: string): Promise<TresponseExpiry> {
        const {product,destination,date,quantity}=this;
        const {added,objects}=Utils.message(), {image,unit,expiryDate}=product;
         try {
            const  user=await User.initialize().validateUser(token)
            if(user.error)return { error: true, message:user.message, data:[],token:user.token };
         const upProd=await ProductMongo.initialize().setDonation(token,product.id,{donation:quantity})
         if(upProd.error)return {error:true,message:upProd.message,data:null,token:user.token };

         const donate=new ExpiryModel({user:user.id,product:product.id,destination,date,quantity,unit,image,name:product.product,expiryDate})
         await donate.save()
         return {error:user.error,message:added(objects.donation),data:null,token:user.token };
         } catch (error) {
         return {error:true,message:<string>error,data:null,token:null };
        }
    }



   async  listDonations(token: string): Promise<TresponseExpiry> {
         const {found}=Utils.message();
         try {
         const  user=await User.initialize().validateUser(token)
         if(user.error)return { error: true, message:user.message, data:[],token:user.token };
         const donations=await  ExpiryModel.find({user:user.id});
         if(!donations)return {error:user.error,message:found,data:null,token:user.token };
        return {error:user.error,message:"",data:donations.map(({user, product,destination, date,expiryDate,name, quantity, unit, image})=>({user, product,destination, date,expiryDate,name, quantity, unit, image}))||null,token:user.token };
         } catch (error) {
         return {error:true,message:<string>error,data:null,token:null}
        }
    }


   async  throw(token: string): Promise<TresponseExpiry> {
        const trash_:number=1;
         try {            
         const {trash,found}=Utils.message()
         const  user=await User.initialize().validateUser(token)
         if(user.error)return { error: true, message:user.message, data:[],token:user.token };
          const res=await ProductModel.findOne({_id:this.product.id,user:user.id});
          if(!res)return {error:true,message:found,data:null,token:user.token };
          res.trash=trash_;
          await res.save()
          return {error:false,message:trash,data:null,token:user.token };
         } catch (error) {
          return {error:true,message:<string>error,data:null,token:null };
        }

    }



}