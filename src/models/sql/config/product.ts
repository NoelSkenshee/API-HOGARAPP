import IproductConfig from '../../Interfaces/config/Iproduct';
import { TconfigResponse } from '../../types/Tconfig';
import Utils from '../../../services/Utils';
import User from '../user';
export default class ConfigProduct implements IproductConfig{
    notify_before_expired: boolean;
    expired_before_n_month: number;
    notify_on_finishing: boolean;
    token: string;
    
     constructor(notify_before_expired: boolean,expired_before_n_month: number,notify_on_finishing: boolean,token: string){
        this.notify_before_expired=notify_before_expired;
        this.expired_before_n_month=expired_before_n_month;
        this.notify_on_finishing=notify_on_finishing;
        this.token=token;
     }

     static initialize(payload?:any){
        if(!payload)return new ConfigProduct(false,0,false,"")
        else{
            const {notify_before_expired,expired_before_n_month,notify_on_finishing,token}=payload;
            return new ConfigProduct(notify_before_expired||false,expired_before_n_month|0,notify_on_finishing||false,token||"")
        }
     }


    async config(): Promise<TconfigResponse> {
        const query=Utils.insert_config_product_p(),{notify_before_expired,expired_before_n_month,notify_on_finishing,token}=this;
        try {
        const conn=await Utils.getConSQL()();
        const {added,objects}=Utils.message()
        const user=await  User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        await conn.query(query,[user.id,notify_before_expired,expired_before_n_month,notify_on_finishing])
        return {error:user.error,message:added(objects.config),data:null,token:user.token};
        } catch (error) {
        return {error:true,message:<string>error,data:null,token:null}
        } 
    }

    
    async getConfig(): Promise<TconfigResponse> {
        const query=Utils.get_config_product_p(),{token}=this;
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