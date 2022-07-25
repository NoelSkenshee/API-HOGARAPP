export  interface  Iqueries{
     token:string
     product:string
     date:Date
     remaining():Promise<{error:boolean,message:string,data:number}>
     durationDays(expiryDate:Date):number
     wast(quantity:number,expiryDate:Date):Promise<{error:boolean,message:string,data:number}>
     consumptionDays(quantity:number):Promise<{error:boolean,message:string,data:number}>
     recomendation(expiryDate:Date):Promise<{error:boolean,message:string,data:number}>
}