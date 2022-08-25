const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('./../config/config');
const UserService = require('./user.service');
const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    user.password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    };
  }

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: config.admin_mail,
        pass: config.api_gmail
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: config.admin_mail, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Este es un nuevo correo", // Subject line
      text: "Hola Gaby ", // plain text body
      html: "<b>Hola Gaby fgfgfgg</b>", // html body
    });
    return { message: 'Mail sent' };
  }
}

module.exports = AuthService;
