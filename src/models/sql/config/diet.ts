import IdietConfig from '../../Interfaces/config/Idiet';
import { TconfigResponse } from '../../types/Tconfig';
import Utils from '../../../services/Utils';
import User from '../user';
export default class ConfigDiet implements IdietConfig{
    google_calendar: boolean;
    notify_by_mail: boolean;
    token: string;


   constructor(google_calendar: boolean,notify_by_mail: boolean,token: string){
    this.google_calendar=google_calendar;
    this.notify_by_mail=notify_by_mail;
    this.token=token;
   }


   static initialize(payload?:any){
        if(!payload)return new ConfigDiet(false,false,"");
        else {
            const {google_calendar,notify_by_mail,token}=payload;
            return new ConfigDiet(google_calendar||false,notify_by_mail||false,token||"");
        }
   }

   async config(): Promise<TconfigResponse> {
    const query=Utils.insert_config_diet_p(),{google_calendar,notify_by_mail,token}=this;
    try {
    const conn=await Utils.getConSQL()();
    const {added,objects}=Utils.message()
    const user=await  User.initialize().validateUser(token);
    if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
    await conn.query(query,[user.id,google_calendar,notify_by_mail])
    return {error:user.error,message:added(objects.config),data:null,token:user.token};
    } catch (error) {
    return {error:true,message:<string>error,data:null,token:null}
    } 
}


async getConfig(): Promise<TconfigResponse> {
    const query=Utils.get_config_diet_p(),{token}=this;
    try {
    const conn=await Utils.getConSQL()();
    const user=await  User.initialize().validateUser(token);
    if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
    const res=await conn.query(query,[user.id])
    if(res[0][0])return {error:user.error,message:"",data:res[0][0],token:user.token};
    else return {error:user.error,message:"",data:{},token:user.token};
    } catch (error) {
    return {error:true,message:<string>error,data:null,token:null}
    }
}


}