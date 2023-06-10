import { Status } from "./status";

export interface LoginResponseModel extends Status{
    accessToken:string, 
         refreshToken :string,
         expiration:string,
         name:string,
         username :string
}