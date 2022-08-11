import Idiet from "../Interfaces/Idiet";
import { TdaysTime, TresponseDiet, Tdiet } from '../types/Tdiet';
import Utils from '../../services/Utils';
import User from './user';
import Product from './product';
import Queries from './queries/product';

export default class Diet implements Idiet{
    token:string;
    id:number
    product: string;
    quantity: number;
    daysTime: TdaysTime[];
    durationDays: number;
    image:any
    countDay:number
    initDate:Date
    endDate:Date
    private static diet:Diet
    
   private  constructor(token:string,id:number,product: string,quantity: number,daysTime: TdaysTime[],durationDays: number,countDay:number,image:any,initDate:Date,endDate:Date){
          this.id=id
           this.token=token
          this.product=product
          this.quantity=quantity
          this.daysTime=daysTime
          this.durationDays=durationDays,
          this.image=image
          this.countDay=countDay;
          this.initDate=initDate;
          this.endDate=endDate;

    }

    
    static initialize(payload?:any){
        let dt:any=[]
        if(!payload)return Diet.diet=new Diet("",0,"",0,dt,0,0,"",new Date,new Date)
        else {
            const {token,product,quantity,daysTime,durationDays,image,countDay,id,initDate,endDate}=payload;
            return Diet.diet=new Diet(token||"",id|0,product||"",quantity|0,daysTime||dt,durationDays|0,countDay|0,image||"",initDate||new Date,endDate||new Date)
        }
    }

    private async dayTime(){
        const conn=Utils.getConSQL(),query=Utils.insertDietdays(),{id,daysTime}=this;          
         try {
              const db=await (await conn())
              daysTime.forEach(async (day) => {
                db.query(query,[day.day,day.time,id])
              });
             return {error:false,message:"",data:null}
            } catch (error) {
             return {error:false,message:<string>error,data:null}
             }
    }

    private async  getDays(diet:number){
          const conn=Utils.getConSQL(),subQuery=Utils.listDaysTime();
           try {
             return  (await (await conn()).query(subQuery,[diet]))
           } catch (error) {
             return false;
           }
     }


   async createDiet(): Promise<TresponseDiet> {
         const conn=Utils.getConSQL(),query=Utils.insertDietP(),{image,product,quantity,daysTime,durationDays,initDate,endDate}=this;          
         try {
             const {error,message,id,token}=await  User.initialize().validateUser(this.token);
             if(error)return {error,message,data:null,token};
             if(image){
             const file=await Product.initialize({image}).insertIamge();
             if(file.error)return {error:true,message:file.message||"",data:null,token}
             }
             const durationDays=Queries.instance({}).diferenceDate(initDate,endDate)
             const res=await (await conn()).query(query,[id,product,quantity,durationDays,initDate,endDate])
             this.id=res[0][0].id
             if(this.id)this.dayTime()
             return {error:false,message:"",data:null,token}
            } catch (error) {
             return {error:false,message:<string>error,data:null,token:null}
             }
    }


   async  listDiets(): Promise<TresponseDiet> {
       const conn=Utils.getConSQL(),query=Utils.listDietsDP(),{token}=this;          
    try {
        const user=await  User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        const res=await (await conn()).query(query,[user.id])
        if(res[0]){
           await Promise.all(res[0].map(async (diet:Tdiet,index:number)=>{
                 const res_=await this.getDays(diet.id)
                 if(res_)res[0][index].daysTime=res_[0]
                 return diet;
            }))
        }
        return {error:false,message:"",data:res[0],token:user.token}
       } catch (error) {
        return {error:false,message:<string>error,data:null,token:null}
        }
    }


    async incrementCountDay(): Promise<TresponseDiet> {
        const conn=Utils.getConSQL(),query=Utils.incrementDietDP(),{token,id,countDay}=this;          
        try {
            const user=await  User.initialize().validateUser(token);
            if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
             const [days]=await this.getDays(id);
             let isDayRegisted=false;
             if(days)return await Promise.all(days.map((d:TdaysTime)=>{
                if(d.day==(new Date()).getDay())isDayRegisted=!isDayRegisted;
              })).then(async ()=>{
                const currentDate=new Date(),res=(await conn()).query(query,[user.id,id,currentDate,currentDate.getDay()])
                return {error:false,message:"",data:null,token:user.token}
              })
              else  return {error:false,message:"",data:null,token:user.token}
           } catch (error) {
            return {error:false,message:<string>error,data:null,token:null}
            }
        }

}