export type Tmessage={
   component:string,
   email:string,
   message:string
   ratting:number
}

export type TresponseMessage={
    error:boolean,
    message:string,
    data:any,
    token:string|null
}