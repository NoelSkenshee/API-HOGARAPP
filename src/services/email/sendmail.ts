import sg from "sendgrid"; //(process.env.SENDGRID_API_KEY);

import Utils from "../Utils";

export default class Mail extends Utils {
  private static senKey = process.env.HOGARAPP_EMAIL_KEY || "";
  constructor() {
    super();
  }
  public static verify_user_mail(name: string, to: string, token: string) {
    const mail = sg(Mail.senKey);
    const payload = Utils.getMialPayload();
    var request = mail.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: {
        personalizations: [
          {
            to: [
              {
                email: to,
              },
            ],
            subject: payload.subject(),
          },
        ],
        from: {
          email: process.env.HOGARAPP_EMAIL,
        },
        content: [
          {
            type: "text/html",
            value: payload.text(name, token),
          },
        ],
      },
    });
    return mail.API(request);
  }
}
