import { TresponsePassword } from "../types/Tpassword"

export interface Ipassword{
    new_password:string
    token:string
    change():Promise<TresponsePassword>
    verifyChange():Promise<TresponsePassword>

}