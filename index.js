//Firebase
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//Sendgrid
const sendgridemail = require('@sendgrid/mail');
//Iniciar o firebase
admin.initializeApp(functions.config().firebase);
//Sendgrid config
const api = 'apiKey'
sendgridemail.setApiKey(api);

//Escutar todo registro dentro de 'Orders'
exports.enviarEmail = functions.firestore
    .document('Orders/{orderId}')
    .onCreate((snap, context) => {
        //Organizar dados
        const res = snap.data();
        console.log("Para: " + res.email);
        const msgbody = {
            to: res.email,
            from: 'fromMail',
            subject: 'Subject',
            templateId: 'templateId',
            substitutionWrappers: ['{{', '}}'],
            substitutions: {
                name: res.name
            }
        };
        sendgridemail.send(msgbody)
        .then(() => {
            console.log("Enviado!")
        })
        .catch((err) => {
            console.log(err)
        })
    });