type Token  ={token:string}

export default interface IUser{
       name:string;
       email:string;
       password:string;
       verified:boolean;

       
       insert():Promise<{error:boolean,message:string}>;
}