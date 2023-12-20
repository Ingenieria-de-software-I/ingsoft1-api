import { google } from 'googleapis';
import { default as nodemailer } from 'nodemailer';

import { MailerClient } from '../mail/types';
import { Options } from '../mail/types';

const OAuth2 = google.auth.OAuth2;

export class RealMailer implements MailerClient {
    constructor(
        private _config: {
            user: string;
            clientId: string;
            clientSecret: string;
            refreshToken: string;
        },
    ) {}

    private async _createTransporter() {
        const { user, clientId, clientSecret, refreshToken } = this._config;

        const oauth2Client = new OAuth2(
            clientId,
            clientSecret,
            'https://developers.google.com/oauthplayground',
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        const accessToken = await new Promise<string>((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.log('*ERR: ', err);
                    reject();
                }
                resolve(token!);
            });
        });

        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'oauth2',
                user,
                clientId,
                clientSecret,
                refreshToken,
                accessToken,
            },
        });
    }

    async sendMail(to: string, options: Options) {
        const transporter = await this._createTransporter();
        await transporter.sendMail({ to, ...options });
    }
}
