import { TresponseMessage } from '../types/Tmessage';
export interface Imessage{
    component:string,
    email:string,
    message:string
    token:string
    ratting:number
    insertMessage():Promise<TresponseMessage>
}