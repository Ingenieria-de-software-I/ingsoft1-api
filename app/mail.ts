import dotenv from 'dotenv';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

async function createTransporter() {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
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
            user: process.env.USER_EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken,
        },
    });
}

export async function sendMail(from: string, to: string) {
    const transporter = await createTransporter();
    return await transporter.sendMail({
        from,
        to,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
    });
}
