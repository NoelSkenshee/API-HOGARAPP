import { TresponseDiet, TdaysTime } from '../types/Tdiet';
export default interface Idiet{
token:string,
product:string,
quantity:number,
daysTime:TdaysTime[],
durationDays:number,
image:any,
countDay:number,
initDate:Date,
endDate:Date
createDiet():Promise<TresponseDiet>
incrementCountDay():Promise<TresponseDiet>
listDiets():Promise<TresponseDiet>
}