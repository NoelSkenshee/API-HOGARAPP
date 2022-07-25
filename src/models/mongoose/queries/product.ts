import { Iqueries } from '../../Interfaces/Iqueries';
import Utils from '../../../services/Utils';
import User from '../user';
import ProductMongo from '../product';
import Consumption from '../../sql/consumption';
import ConsumptionMONGO from '../consumtions';
export default class QueriesMONGO extends Utils implements Iqueries{


    token: string;
    product: string;
    date: Date;


    constructor(token:string,product:string){
         super()
         this.date=new Date();
         this.token=token;
         this.product=product;
        
    }



    public static instance(payload:any){
         if(!payload)return new QueriesMONGO("","")
         else{
         const {token,product}=payload;
         return new QueriesMONGO(token||"",product||"")
         }
    }


    async remaining(): Promise<{ error: boolean; message: string; data: number; }> {
        const {not_exist}=Utils.message();
        try {
           const {error,id}=await User.initialize().validateUser(this.token)
           if(error)return {error:true,message:not_exist,data:0}
           const  products=await ProductMongo.initialize().list_unexpired(this.token)
           if(products.error)return {error,message:products.message,data:0}
           let consuptions=0,donations=0,quantity=0;
           await Promise.all(products.data.map((p)=>{
            if(this.product==p.product)consuptions+=p.consumption;donations+=p.donate,quantity+=p.quantity;
           }));
           return {error:false,message:"",data:quantity-(consuptions+donations)}
         } catch (error) {
            return {error:true,message:<string>error,data:0}
        }     
    }


    async average(){
        const {not_exist}=Utils.message();
           try {
            const {error,id}=await User.initialize().validateUser(this.token)
            if(error)return {error:true,message:not_exist,data:0}
            const {data}=await ConsumptionMONGO.initialize().listConsumtion(this.token);
            let repeat=1,quantity=0;
            await Promise.all(data.map((c)=>{
                if(c.product==this.product){
                    quantity+=c.quantity;
                    repeat++;
                }
            }))
            return {error:false,message:"",data:quantity/repeat}
           } catch (error) {
            return {error:true,message:<string>error,data:0}
           } 
    }




    durationDays(expiryDate:Date):number{
        const hours=60,day=24,mins=(((new Date(this.date).getSeconds()/1)*hours-(new Date(expiryDate).getSeconds()/1)*hours));
        return ((mins/hours)/day)
    }



    async wast(quantity: number, expiryDate: Date): Promise<{ error: boolean; message: string; data: number; }> {
         const {not_exist}=Utils.message();
        try {
           const {error,id}=await User.initialize().validateUser(this.token)
           if(error)return {error:true,message:not_exist,data:0}
           const  average=await this.average(),duration=this.durationDays(expiryDate);
           if(average.error)return {error:true,message:"",data:0}
           return {error:false,message:"",data:(duration*average.data)-quantity}
         } catch (error) {
            return {error:true,message:<string>error,data:0}
        }     
        }


   async  consumptionDays(quantity: number): Promise<{ error: boolean; message: string; data: number; }> {
    const {not_exist}=Utils.message();
    try {
       const {error,id}=await User.initialize().validateUser(this.token)
       if(error)return {error:true,message:not_exist,data:0}
       const  average=await this.average();
       if(average.error)return {error:true,message:"",data:0}
       return {error:false,message:"",data:(quantity/average.data)}
     } catch (error) {
        return {error:true,message:<string>error,data:0}
    }     
    }

    


    async recomendation(expiryDate: Date): Promise<{ error: boolean; message: string; data: number; }> {
        const {not_exist}=Utils.message();
        try {
           const {error,id}=await User.initialize().validateUser(this.token)
           if(error)return {error:true,message:not_exist,data:0}
           const  average=await this.average(),duration=this.durationDays(expiryDate);
           if(average.error)return {error:true,message:"",data:0}
           return {error:false,message:"",data:(duration/average.data)}
         } catch (error) {
            return {error:true,message:<string>error,data:0}
        }     
    }









}