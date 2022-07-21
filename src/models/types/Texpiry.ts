export type Tdonate={
    user:number | string,
    product:number | string,
	destination:string,
    date:Date,
    expiryDate:Date,
	quantity:number,
	unit:string,
    image:string
}
export type TresponseExpiry={
    error:boolean,
    message:string|null,
    data:null|Tdonate[];
}