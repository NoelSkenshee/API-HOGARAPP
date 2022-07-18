import sg from "@sendgrid/mail"; //(process.env.SENDGRID_API_KEY);

import Utils from "../Utils";

export default class Mail extends Utils {
  private static senKey = process.env.HOGARAPP_EMAIL_KEY || "";
  constructor() {
    super();
  }
  public static verify_user_mail(name: string, to: string, token: string) {
     sg.setApiKey(this.senKey)
    const payload = Utils.getMialPayload();
     const msg={
      from: process.env.HOGARAPP_EMAIL?process.env.HOGARAPP_EMAIL:"",
      to,
      subject: payload.subject(),
      text:"",
      html:payload.text(name, token)
     };
  return   sg.send(msg)
   
}
}
