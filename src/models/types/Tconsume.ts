export  type Tconsumtion={
     product:number
     user:number
     quantity:number
     date:Date
}



export type TresponseConsumtion={
    error:boolean,
    message:string,
    data:Tconsumtion[]
    token:string|null
}