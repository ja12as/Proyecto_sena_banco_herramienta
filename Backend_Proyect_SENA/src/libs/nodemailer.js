import nodemailer from "nodemailer";
// Parte de codigo donde se envia lo del correo
export const enviarCorreo = (
  htmlContent,
  email,
  subject = "Sistema Inventario Mobiliario SENA"
) => {
  return new Promise(async (resolve, reject) => {
    // Lo de configNodemailer se saco de investigación
    try {
      const configNodemailer = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "inventariodelmobiliario@gmail.com", // tu correo electrónico
          pass: "xieo yngh kruv rsta", // tu contraseña
        },
      };

      //Transport data funciona para la tranferencia y comunicacion del correo con el sistema
      const transportData = nodemailer.createTransport(configNodemailer);

      //Aqui va el email donde va salir el mensaje y el que tiene la clave de seguridad activa
      const message = {
        from: "inventariodelmobiliario@gmail.com",
        to: email,
        subject,
        html: htmlContent, 
      };

      const infoResponse = await transportData.sendMail(message);

      resolve(infoResponse);
    } catch (error) {
      reject(error);
    }
  });
};

