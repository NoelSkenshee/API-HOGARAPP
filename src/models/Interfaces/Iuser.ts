type Token  ={token:string}

export default interface IUser{
       name:string
       email:string
       password:string
       verified:boolean
       insert():Promise<{error:boolean,message:string}>;
       getUser(id: number):Promise<{error:boolean,message:string}>;
       verifyUser(token: string):Promise<{error:boolean,message:string}>;
       login():Promise<{error:boolean,message:string}>;
       validateUser(token:string):Promise<{error:boolean,message:string,id:null|number|string,token:string|null,email:string|null}>;
}