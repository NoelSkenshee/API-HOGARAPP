import { TconfigResponse } from '../../types/Tconfig';
export default interface IproductConfig{
    notify_before_expired:boolean,
    expired_before_n_month:number,
    notify_on_finishing:boolean,
    token:string
    config():Promise<TconfigResponse>
    getConfig():Promise<TconfigResponse>
}