const Mailjet = require('node-mailjet');
require('dotenv').config();

const mailjet_public_key = process.env.PUBLICMAIL;
const mailjet_private_key = process.env.PRIVATEMAIL;

const mailjet = Mailjet.apiConnect(
    mailjet_public_key,
    mailjet_private_key
);

class EmailRepository {
    static async sendVerificationEmail(firstname, lastname, email, token, backend, port) {
        const verificationLink = `http://${backend}:${port}/verify-email?token=${token}`;

        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "clashofstudentes@gmail.com",
                            Name: "Clash of Students"
                        },
                        To: [
                            {
                                Email: email,
                                Name: `${firstname} ${lastname}`
                            }
                        ],
                        Subject: "Email Verifizierung",
                        TextPart: `Hallo ${firstname}, 
    
                        willkommen bei Clash of Students! Wir freuen uns sehr, dass du Teil unserer Community werden möchtest. 
                        
                        Um deinen Account zu aktivieren und alle Vorteile zu nutzen, bestätige bitte deine E-Mail-Adresse, indem du auf den folgenden Link klickst: 
                        ${verificationLink}
    
                        Sobald deine E-Mail-Adresse bestätigt ist, kannst du auf verschiedene Level zugreifen und diese spielen, um dein Können unter Beweis zu stellen und Fortschritte zu erzielen.
    
                        Solltest du diese Registrierung nicht durchgeführt haben, kannst du diese E-Mail einfach ignorieren.
    
                        Bei Fragen oder Problemen kannst du dich jederzeit an uns wenden.
    
                        Vielen Dank und viel Erfolg bei Clash of Students!`,
                        HTMLPart: `<p>Hallo ${firstname},</p>
                        <p>willkommen bei Clash of Students! Wir freuen uns sehr, dass du Teil unserer Community werden möchtest.</p>
                        <p>Um deinen Account zu aktivieren und alle Vorteile zu nutzen, bestätige bitte deine E-Mail-Adresse, indem du auf den folgenden Link klickst:</p>
                        <a href="${verificationLink}">Email bestätigen</a>
                        <p>Sobald deine E-Mail-Adresse bestätigt ist, kannst du auf verschiedene Level zugreifen und diese spielen, um dein Können unter Beweis zu stellen und Fortschritte zu erzielen.</p>
                        <p>Solltest du diese Registrierung nicht durchgeführt haben, kannst du diese E-Mail einfach ignorieren.</p>
                        <p>Bei Fragen oder Problemen kannst du dich jederzeit an uns wenden.</p>
                        <p>Vielen Dank und viel Erfolg bei Clash of Students!</p>`
                    }
                ]
            });

        try {
            return await request;
        } catch (err) {
            console.log(err.statusCode);
            throw err;
        }
    }


    static async sendResetPasswordEmail(firstname, lastname, email, token, backend, port) {
        const resetLink = `http://${backend}:${port}/reset-password/${token}`;

        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "clashofstudentes@gmail.com",
                            Name: "Clash of Students"
                        },
                        To: [
                            {
                                Email: email,
                                Name: `${firstname} ${lastname}`
                            }
                        ],
                        Subject: "Passwort zurücksetzen",
                        TextPart: `Hallo ${firstname}, 
                        
                        du erhältst diese E-Mail, weil eine Anfrage zum Zurücksetzen deines Passworts gestellt wurde. 
                        Falls du diese Anfrage nicht selbst gemacht hast, ignoriere diese Nachricht bitte. 
                        Andernfalls klicke auf den folgenden Link oder kopiere ihn in deinen Browser, um den Vorgang abzuschließen: 
                        
                        ${resetLink}`,
                        HTMLPart: `<p>Hallo ${firstname},</p>
                        <p>du erhältst diese E-Mail, weil eine Anfrage zum Zurücksetzen deines Passworts gestellt wurde. 
                        Falls du diese Anfrage nicht selbst gemacht hast, ignoriere diese Nachricht bitte.</p>
                        <p>Andernfalls klicke auf den folgenden Link oder kopiere ihn in deinen Browser, um den Vorgang abzuschließen:</p>
                        <a href="${resetLink}">Passwort zurücksetzen</a>`
                    }
                ]
            });

        try {
            return await request;
        } catch (err) {
            console.log(err.statusCode);
            throw err;
        }
    }

}

module.exports = EmailRepository;
