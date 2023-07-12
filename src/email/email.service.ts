import config from '../../config/default';
import { Injectable, Logger } from '@nestjs/common';
import EMAIL_VERIFICATION from 'src/mail-templates/email-verifcation';
import PASSWORD_RESET_EMAIL from 'src/mail-templates/password-reset';
import NodemailerModule from 'src/utils/Nodemailer';
const _nodeMailerModule = new NodemailerModule();

const emailType: EmailType = {
  WELCOME_EMAIL: [`Welcome to ${config().appName}`, 'welcome'],
  PASSWORD_RESET_INSTRUCTION: ['Password Reset Requested', 'password-reset'],
  PASSWORD_RESET_SUCCESSFUL: ['Password Reset', 'password-reset-successful'],
  EMAIL_VERIFICATION: ['Email Verification Requested', 'email-verification'],
  PASSWORD_CHANGED: ['Password Changed', 'password-changed'],
  PAYMENT_TRACKING: ['Payment Tracking', 'payment-tracking'],
  TRANSACTION_NOTIFICATION: [
    'Transaction Notification',
    'transaction-notification',
  ],
  PAYMENT_UNSUCCESSFUL: ['Payment Unsuccessful', 'payment-unsuccessful'],
  SCHEDULE_ENDED: ['Schedule payment period ended', 'schedule-ended'],
  ADMIN_LOGIN_CREDENTIALS: [
    `${config().appName} Login Credentials`,
    'admin-login-credentials',
  ],
};

type Data = {
  [T: string]: string;
};

type EmailOptions = {
  from: string;
  to: string;
  html?: string;
  fullName?: string;
  subject?: string;
};

type EmailType = {
  [k: string]: string[];
};

@Injectable()
export default class EmailService {
  /** Send email takes the following parameters:
   * type - refers to the type of the email eg WelcomeEmail
   * to - refers to who you are sending the email to
   * data - refers to what you want to send to the user
   */
  async _sendMail(type: string, email: string, data: Data) {
    const mailOptions: EmailOptions = {
      from: config().from,
      to: email,
    };
    const [subject, templatePath] = emailType[type] || [];
    if (!subject || !templatePath) return;
    switch (templatePath) {
      //   case 'welcome':
      //     mailOptions.html = WELCOME_EMAIL(data.fullName, data.url);
      //     mailOptions.subject = `${subject} ${data.fullName}`;
      //     break;
      case 'password-reset':
        mailOptions.html = PASSWORD_RESET_EMAIL(data.fullName, data.token);
        mailOptions.subject = `[URGENT] - ${subject}`;
        break;
      case 'email-verification':
        mailOptions.html = EMAIL_VERIFICATION(data.fullName, data.token);
        mailOptions.subject = `[${config().appName}] ${subject}`;
        break;
      // case 'transaction-notification':
      //   mailOptions.html = TRANSACTION_NOTIFICATION(
      //     data.fullName,
      //     data.message,
      //   );
      //   mailOptions.subject = `${config().appName} - ${subject}`;
      //   break;
    }

    await _nodeMailerModule.send(mailOptions);
    Logger.log(`Email on it's way to ${email}`);
  }

  async _sendWelcomeEmail(fullName: string, email: string) {
    return await this._sendMail('WELCOME_EMAIL', email, { fullName });
  }

  async _sendUserEmailVerificationEmail(
    fullName: string,
    email: string,
    token: string,
  ) {
    return await this._sendMail('EMAIL_VERIFICATION', email, {
      fullName,
      token,
    });
  }

  async _sendUserPasswordResetInstructionEmail(
    fullName: string,
    email: string,
    token: string,
  ) {
    return await this._sendMail('PASSWORD_RESET_INSTRUCTION', email, {
      fullName,
      token,
    });
  }

  async sendPaymentTrackingEmail(message: string) {
    return await this._sendMail('PAYMENT_TRACKING', 'info.ezecodes@gmail.com', {
      message,
    });
  }

  async transactionNotificationEmail(
    to: string,
    fullName: string,
    message: string,
  ) {
    return await this._sendMail('TRANSACTION_NOTIFICATION', to, {
      fullName,
      message,
    });
  }

  async paymentUnsuccessfulEmail(
    to: string,
    fullName: string,
    message: string,
  ) {
    return await this._sendMail('PAYMENT_UNSUCCESSFUL', to, {
      fullName,
      message,
    });
  }

  async scheduleEndedEmail(to: string, fullName: string, message: string) {
    return await this._sendMail('SCHEDULE_ENDED', to, {
      fullName,
      message,
    });
  }

  async sendAdminLoginCredentials(
    to: string,
    fullName: string,
    message: string,
    password: string,
  ) {
    return await this._sendMail('ADMIN_LOGIN_CREDENTIALS', to, {
      fullName,
      message,
      password,
    });
  }
}
