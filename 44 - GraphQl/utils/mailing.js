const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporterGmail = nodemailer.createTransport({    
    secure: false, // use SSL    
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    },
    tls: {
        rejectUnauthorized: false
    }    
});


function createMailOptions(operacion, data){
    let mailOptions;
    let titulo;
    let mensaje;
    //let picture = JSON.stringify(usuario.photos[0].value)
    
    if(operacion == 'nuevo-usuario'){
        titulo = 'nuevo registro'
        mensaje = `<h1> NUEVO USUARIO REGISTRADO</h1>
        <ul>
        <li>USER:${data.username}</li>        
        <li>MAIL: ${data.mail}</li>
        <li>CEL: ${data.telefono}</li>
        </ul>`;
        mailOptions = createOptions(mailOptions, titulo, mensaje, null);      
    }
    
    if(operacion == 'compra'){      
      let mail = data.shift();     
      titulo = 'nueva compra';
      mensaje = `<h1>FELICITACIONES!! COMPRASTE:</h1>`      
      data.forEach( e => {
        mensaje += e
      }) 
      mailOptions = createOptions(mailOptions, titulo, mensaje, mail);      
  }

    transporterGmail.sendMail(mailOptions, (err, info) => {
        if (err) {
            logger.error(err)
            return err
        }
        logger.error(info)
        logger.warn("MAIL ENVIADO EXITOSAMENTE")
    });    
}

function createOptions(mailOptions, titulo, mensaje, mail){

  if(mail == null){
    mail = mailServidor;
  }

  mailOptions = {
    from: mailServidor,
    to: mail,
    subject: titulo,
    html: mensaje
}

  return mailOptions;
}


module.exports = createMailOptions;

