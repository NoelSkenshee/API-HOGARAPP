import User from './user';
import { Ipassword } from '../Interfaces/Ipassword';
import { TresponsePassword } from '../types/Tpassword';
import Utils from '../../services/Utils';
import Mail from '../../services/email/sendmail';
export default class Password extends User implements Ipassword{
  new_password:string;
  token:string
  constructor(password:string,email:string,new_password:string,token:string){
     super("",email,password)
     this.new_password=new_password
     this.token=token
  }

  static initialize(payload?: any): Password{
   
     if(!payload)return new Password("","","","")
     else {
        const {new_password,token,email,password}=payload;
        return new Password(password||"",email||"",new_password||"",token||"")
     }
  }


   async  change(): Promise<TresponsePassword> {
        const query=Utils.change_pass_P(),{login,new_password,email}=this;
        try {
        const conn=await Utils.getConSQL()();
        const {changePending}=Utils.message()
        const {error,message,token} =await User.initialize({email,password:this.password}).login()
        if(error)return {error:error,message:message,data:null,token:token};
         await conn.query(query,[new_password,email])
         const payload = Utils.getMialPayload("password");
         await Mail.sendMail(email,payload.text(email,token||""),payload.subject());
         return {error:error,message:changePending,data:null,token:token};
        } catch (error) {
        return {error:true,message:<string>error,data:null,token:null}
        }
    }

   async verifyChange(): Promise<TresponsePassword> {
        const query=Utils.verify_change_pass_P(),{token}=this;
        try {
        const conn=await Utils.getConSQL()();
        const {passwordChange}=Utils.message()
        const user=await  User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        await conn.query(query,[user.id,user.email])
        return {error:user.error,message:passwordChange,data:null,token:user.token};
        } catch (error) {
        return {error:true,message:<string>error,data:null,token:null}
        }

    }

    async verifyStatus(){
        const query=Utils.status_change_pass_P(),{token}=this;
        try {
        const conn=await Utils.getConSQL()();
        const user=await  User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        const res=await conn.query(query,[user.id,user.email])
        if(res[0][0].changePasswordPending)return {error:user.error,message:"",data:1,token:user.token};
        else return {error:user.error,message:"",data:0,token:user.token};
        } catch (error) {
        return {error:true,message:<string>error,data:null,token:null}
        }
    }










}