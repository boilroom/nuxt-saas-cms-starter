import fs from 'fs';
// import dayjs from 'dayjs'; // Use this line if you have dayjs installed
// import postmark from 'postmark'; // Use this line if you want to send real emails using Postmark

export class EmailSender {

  private template: string;
  private from: string;
  private to: string;
  private subject: string;

  public constructor(template: string, from: string, to: string, subject: string, fromName?: string) {
    this.template = template;
    this.to = to;
    this.subject = subject;
    this.from = fromName ? `${fromName} <${from}>` : from;
  }

  public async send() {
    if (process.env.NODE_ENV === 'development') {
      // Save email to file in development mode:
      const tempEmlDir = `${process.cwd()}/_tmp/mail`;
      if (!fs.existsSync(tempEmlDir)) {
        fs.mkdirSync(tempEmlDir, { recursive: true });
      }
      fs.writeFileSync(
        `${tempEmlDir}/${new Date().getTime()}.eml`, // or `${tempEmlDir}/${dayjs().format('DD-MM-YY__HH-mm-ss')}.eml` if you have dayjs installed
        `From: ${this.from}\nTo: ${this.to}\nSubject: ${this.subject}\nContent-Type: text/html; charset=UTF-8\n\n${this.template}`,
      );
    } else {
      // Send real email using Postmark (for example):
      // const options = {
      //   'From': this.from,
      //   'To': this.to,
      //   'Subject': this.subject,
      //   'HtmlBody': this.template,
      // };
      // const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
      // await client.sendEmail(options);
    }
    return true;
  }

}