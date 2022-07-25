export  type Tproduct={
    id:string|number
    user:string	
    product:string	
    category:string	
    createdAt:string	
    expiryDate:Date	
    consumption:number
    donate:number
    total:number	
    quantity:number	
    unit:string	
    price:number,
    image:string
}


export type image={
    product:string,
    image:string,
    alt:string
}



export type ReqImage= {
    name:string,
    data: Buffer,
    tempFilePath: string,
    truncated: boolean,
    mimetype:string,
    md5: string,
    mv: Function
  }