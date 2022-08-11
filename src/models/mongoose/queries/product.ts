import { Iqueries } from '../../Interfaces/Iqueries';
import Utils from '../../../services/Utils';
import User from '../user';
import ProductMongo from '../product';
import ConsumptionMONGO from '../consumtions';
import { Tquery_response } from '../../types/Tqueries';
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


    async remaining(): Promise<Tquery_response> {
        const {not_exist}=Utils.message();
        try {
            const  user=await User.initialize().validateUser(this.token)
            if(user.error)return { error: true, message:user.message, data:0,token:user.token };
           const  products=await ProductMongo.initialize().list_unexpired(this.token)
           if(products.error)return {error:true,message:products.message,data:0,token:user.token };
           let consuptions=0,donations=0,quantity=0;
           await Promise.all(products.data.map((p)=>{
            if(this.product==p.product)consuptions+=p.consumption;donations+=p.donate,quantity+=p.quantity;
           }));
           return {error:false,message:"",data:quantity-(consuptions+donations),token:user.token };
         } catch (error) {
            return {error:true,message:<string>error,data:0,token:null };
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




  
    diferenceDate(init:Date,end:Date):number{
        const hours=60,day=24,time=((new Date(end).getTime())-((new Date(init).getTime())));
        return Math.round(time/(1000*hours*hours*day))
    }



    async wast(quantity: number, expiryDate: Date): Promise<Tquery_response> {
         const {not_exist}=Utils.message();
        try {
            const  user=await User.initialize().validateUser(this.token)
            if(user.error)return { error: true, message:user.message, data:0,token:user.token };
           const  average=await this.average(),duration=this.diferenceDate(new Date(),expiryDate);
           if(average.error)return {error:true,message:"",data:0,token:user.token };
           return {error:false,message:"",data:(duration*average.data)-quantity,token:user.token };
         } catch (error) {
            return {error:true,message:<string>error,data:0,token:null };
        }     
        }


   async  consumptionDays(quantity: number): Promise<Tquery_response> {
    const {not_exist}=Utils.message();
    try {
        const  user=await User.initialize().validateUser(this.token)
        if(user.error)return { error: true, message:user.message, data:0,token:user.token };
       const  average=await this.average();
       if(average.error)return {error:true,message:"",data:0,token:user.token };
       return {error:false,message:"",data:(quantity/average.data),token:user.token };
     } catch (error) {
        return {error:true,message:<string>error,data:0,token:null };
    }     
    }

    


    async recomendation(expiryDate: Date): Promise<Tquery_response> {
        const {not_exist}=Utils.message();
        try {
            const  user=await User.initialize().validateUser(this.token)
            if(user.error)return { error: true, message:user.message, data:0,token:user.token };
           const  average=await this.average(),duration=this.diferenceDate(new Date(),expiryDate);
           if(average.error)return {error:true,message:"",data:0,token:user.token };
           return {error:false,message:"",data:(duration/average.data),token:user.token };
         } catch (error) {
            return {error:true,message:<string>error,data:0,token:null };
        }     
    }









}