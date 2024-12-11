class Mailer {
  constructor(from, replyTo) {
    this._name = from;
    this._replyTo = replyTo;
  }

  send(to, subject, text, html) {
    GmailApp.sendEmail(to, subject, text, {
      cc: this._replyTo,
      replyTo: this._replyTo,
      name: this._name,
      htmlBody: html,
    });
  }
}
