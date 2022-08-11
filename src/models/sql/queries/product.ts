import { Iqueries } from '../../Interfaces/Iqueries';
import Utils from '../../../services/Utils';
import User from '../user';
import { Tquery_response } from '../../types/Tqueries';
export default class Queries extends Utils implements Iqueries{



    token: string;
    product: string;
    date: Date;
    //private static queries:Queries


     
   private  constructor(token:string,product:string){
         super()
         this.date=new Date();
         this.token=token;
         this.product=product;

    }




    public static instance(payload:any){
        // if(Queries.queries) return Queries.queries
         if(!payload)return new Queries("","")
         else{
         const {token,product}=payload;
         return new Queries(token||"",product||"")
         }
    }




    async remaining(){
        const {not_exist}=Utils.message(),query=Utils.product_remainingP();
        try {
           const  conn=await Utils.getConSQL()();
           const {error,id,token}=await User.initialize().validateUser(this.token)
           if(error)return {error:true,message:not_exist,data:{remaining:0,unit:""},token}
           const  res=await conn.query(query,[id,this.product,this.date]);
           return {error:false,message:"",data:{remaining:res[0][0].remaining,unit:res[0][0].unit},token}
         } catch (error) {
            return {error:true,message:<string>error,data:{remaining:0,unit:""},token:null}
        }     
    }




    async average(){
        const {not_exist}=Utils.message(), query=Utils.consumption_averageP();
           try {
            const {error,id,token}=await User.initialize().validateUser(this.token)
            if(error)return {error:true,message:not_exist,data:{average:0,unit:""},token}
            const conn=await Utils.getConSQL()(), average=await conn.query(query,[id,this.product]);
            if(!average[0][0])return {error:true,message:"",data:{average:0,unit:""},token}
            return {error:false,message:"",data:{average:<number>average[0][0].average,unit:average[0][0].unit},token}
           } catch (error) {
            return {error:true,message:<string>error,data:{average:0,unit:""},token:null}
           } 
        }




    diferenceDate(init:Date,end:Date):number{
        const hours=60,day=24,time=((new Date(end).getTime())-((new Date(init).getTime())));
        return Math.round(time/(1000*hours*hours*day))
    }



    async wast(quantity: number, expiryDate: Date): Promise<Tquery_response> {
         const {not_exist}=Utils.message();
        try {
           const {error,id,token}=await User.initialize().validateUser(this.token)
           if(error)return {error:true,message:not_exist,data:{wast:0,unit:""},token}
           const  averageRes=await this.average(),duration=this.diferenceDate(new Date(),expiryDate),consumptionD=await this.consumptionDays(quantity),remainingRes=await this.remaining();
           if(averageRes.error)return {error:true,message:"",data:{wast:0,unit:""},token}
           const {average,unit}=averageRes.data,{remaining}=remainingRes.data;
           return {error:false,message:"",data:{wast:(quantity+remaining)-((duration)*average),unit},token}
         } catch (error) {
            return {error:true,message:<string>error,data:{wast:0,unit:""},token:null}
        }     
        }





   async  consumptionDays(quantity: number): Promise<Tquery_response> {
    const {not_exist}=Utils.message();
    try {
       const {error,id,token}=await User.initialize().validateUser(this.token)
       if(error)return {error:true,message:not_exist,data:{consumptionDays:0,unit:""},token}
       const  averageRes=await this.average();
       if(averageRes.error)return {error:true,message:"",data:{consumptionDays:0,unit:""},token}
       const {average,unit}=averageRes.data;
       return {error:false,message:"",data:{consumptionDays:Math.round(quantity/average),unit},token}
     } catch (error) {
        return {error:true,message:<string>error,data:{consumptionDays:0,unit:""},token:null}
    }     
    }

    


    async recomendation(expiryDate: Date): Promise<Tquery_response> {
        const {not_exist}=Utils.message();
        try {
           const {error,id,token}=await User.initialize().validateUser(this.token)
           if(error)return {error:true,message:not_exist,data:{recomendation:0,unit:""},token}
           const  averageRes=await this.average(),duration=this.diferenceDate(new Date(),expiryDate),remainingRes=(await this.remaining());
           if(averageRes.error)return {error:true,message:"",data:{recomendation:0,unit:""},token:null}
           const {average,unit}=averageRes.data,{remaining}=remainingRes.data;
           return {error:false,message:"",data:{recomendation:Math.round(((duration)*average)-(remaining)),unit},token}
         } catch (error) {
            return {error:true,message:<string>error,data:{recomendation:0,unit:""},token:null}
        }     
    }









}