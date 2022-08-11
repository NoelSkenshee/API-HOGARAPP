export type TdaysTime={ day: number; time: string; }

export type Tdiet={
    id:number
    product:string,
    quantity:number,
    daysTime:TdaysTime[],
    durationDays:number,
    image:any,
    countDay:number,
    initDate:Date,
    endDate:Date
}
export type TresponseDiet={
 error:boolean,
 message:string,
 data:Tdiet[]|null,
 token:string|null
}
