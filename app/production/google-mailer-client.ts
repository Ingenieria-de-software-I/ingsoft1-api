import { google } from 'googleapis';
import { default as nodemailer } from 'nodemailer';

import { MailerClient, Options } from '../services/mailer';

const OAuth2 = google.auth.OAuth2;

export class GoogleMailerClient implements MailerClient {
    _transporter?: Promise<nodemailer.Transporter>;

    constructor(
        private _config: {
            user: string;
            clientId: string;
            clientSecret: string;
            refreshToken: string;
            replyTo: string;
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

    private async _getTransporter() {
        this._transporter ??= this._createTransporter();
        return await this._transporter;
    }

    async sendMail(to: string, options: Options) {
        try {
            const transporter = await this._getTransporter();
            await transporter.sendMail({
                to,
                replyTo: this._config.replyTo,
                ...options,
            });
        } catch (error) {
            return String(error);
        }
        return 'ok';
    }
}
