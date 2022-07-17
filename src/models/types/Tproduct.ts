export  type product={
    user:string	
    product:string	
    category:string	
    createdAt:string	
    expiryDate:Date	
    total:number	
    quantity:number	
    unit:string	
    price:number
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