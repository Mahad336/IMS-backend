import * as jwt from 'jsonwebtoken';
//import config from '../config/keys';
require('dotenv').config();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.secretKey, {
    expiresIn: '2d',
  });
};

export { generateToken };
