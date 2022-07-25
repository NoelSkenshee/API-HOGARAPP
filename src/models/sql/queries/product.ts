import { Iqueries } from '../../Interfaces/Iqueries';
import Utils from '../../../services/Utils';
import User from '../user';
export default class Queries extends Utils implements Iqueries{



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
         if(!payload)return new Queries("","")
         else{
         const {token,product}=payload;
         return new Queries(token||"",product||"")
         }
    }




    async remaining(): Promise<{ error: boolean; message: string; data: number; }> {
        const {not_exist}=Utils.message(),query=Utils.product_remainingP();
        try {
           const  conn=await Utils.getConSQL()();
           const {error,id}=await User.initialize().validateUser(this.token)
           if(error)return {error:true,message:not_exist,data:0}
           const  res=await conn.query(query,[id,this.product,this.date]);
           return {error:false,message:"",data:res[0][0].remaining}
         } catch (error) {
            return {error:true,message:<string>error,data:0}
        }     
    }




    async average(){
        const {not_exist}=Utils.message(), query=Utils.consumption_averageP();
           try {
            const {error,id}=await User.initialize().validateUser(this.token)
            if(error)return {error:true,message:not_exist,data:0}
            const conn=await Utils.getConSQL()(), average=await conn.query(query,[id,this.product]);
            if(!average[0][0])return {error:true,message:"",data:0}
            return {error:false,message:"",data:<number>average[0][0].average}
           } catch (error) {
            return {error:true,message:<string>error,data:0}
           } 
        }




    durationDays(expiryDate:Date):number{
        const hours=60,day=24,time=((new Date(expiryDate).getTime())-((new Date(this.date).getTime())));
        return Math.round(time/(1000*hours*hours*day))
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
           return {error:false,message:"",data:(duration*average.data)-(await this.remaining()).data}
         } catch (error) {
            return {error:true,message:<string>error,data:0}
        }     
    }









}