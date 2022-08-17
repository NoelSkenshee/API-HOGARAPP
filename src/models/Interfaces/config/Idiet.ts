import { TconfigResponse } from '../../types/Tconfig';
export default interface IdietConfig{
    google_calendar:boolean,
    notify_by_mail:boolean,
    token:string
    config():Promise<TconfigResponse>
    getConfig():Promise<TconfigResponse>
}