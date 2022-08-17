import sg from "@sendgrid/mail"; //(process.env.SENDGRID_API_KEY);

import Utils from "../Utils";

export default class Mail {
  private static senKey = process.env.HOGARAPP_EMAIL_KEY || "";

  public static  sendMail(to: string,html:string,subject:string) {
     sg.setApiKey(this.senKey)
     const msg={
      from: process.env.HOGARAPP_EMAIL?process.env.HOGARAPP_EMAIL:"",
      to,
      subject,
      html
     };

  return   sg.send(msg)
   
}
}
