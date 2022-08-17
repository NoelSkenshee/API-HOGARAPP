import { Imessage } from "../Interfaces/Imessage";
import { TresponseMessage } from "../types/Tmessage";
import Utils from '../../services/Utils';
import User from './user';

export class Message implements Imessage{
    component: string;
    email: string;
    message: string;
    token: string;
   ratting:number

    
    constructor(component: string, email: string,message: string,token: string, ratting:number){
        this.component=component;
        this.email=email;
        this.message=message;
        this.token=token;
        this.ratting=ratting;

    }


     public static initialize(payload?:any){
       if(!payload)return new Message("","","","",0);
       else{
        const {component,email,message,token,ratting}=payload;
        return new Message(component||"",email||"",message||"",token||"",ratting|0);
       }

     }

    async insertMessage(): Promise<TresponseMessage> {
        const query=Utils.send_message_P(),{token,component,email,message,ratting}=this;
        try {
        const conn=await Utils.getConSQL()();
        const {added,objects}=Utils.message()
        const user=await  User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        await conn.query(query,[component,email,message,ratting])
        return {error:user.error,message:added(objects.message),data:null,token:user.token};
        } catch (error) {
        return {error:true,message:<string>error,data:null,token:null}
        }
    }
    






}