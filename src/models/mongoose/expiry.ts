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
         const {error,message,id}=await User.initialize().validateUser(token);
         if(error)return {error,message,data:null};
         const upProd=await ProductMongo.initialize().setDonation(token,product.id,{donation:quantity})
         if(upProd.error)return {error:true,message:upProd.message,data:null};

         const donate=new ExpiryModel({user:id,product:product.id,destination,date,quantity,unit,image,name:product.product,expiryDate})
         await donate.save()
         return {error,message:added(objects.donation),data:null}
         } catch (error) {
         return {error:true,message:<string>error,data:null}
        }
    }



   async  listDonations(token: string): Promise<TresponseExpiry> {
         const {found}=Utils.message();
         try {
         const {error,message,id}=await User.initialize().validateUser(token);
         if(error)return {error,message,data:null};
         const donations=await  ExpiryModel.find({user:id});
         if(!donations)return {error,message:found,data:null}; 
        return {error,message:"",data:donations.map(({user, product,destination, date,expiryDate,name, quantity, unit, image})=>({user, product,destination, date,expiryDate,name, quantity, unit, image}))||null}
         } catch (error) {
         return {error:true,message:<string>error,data:null}
        }
    }


   async  throw(token: string): Promise<TresponseExpiry> {
        const trash_:number=1;
         try {            
         const {trash,found}=Utils.message()
         const {error,message,id}=await  User.initialize().validateUser(token);
         if(error)return {error,message,data:null};
          const res=await ProductModel.findOne({_id:this.product.id,user:id});
          if(!res)return {error,message:found,data:null};
          res.trash=trash_;
          await res.save()
          return {error,message:trash,data:null}
         } catch (error) {
          return {error:true,message:<string>error,data:null}
        }

    }



}