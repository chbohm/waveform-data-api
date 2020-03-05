import { readFileSync } from 'fs';

import * as jwtSimple from 'jwt-simple';
import * as moment from 'moment';
import { InvalidSessionError } from '../errors/errors';
import { type } from 'os';

const secretKey = readFileSync('secret.txt', 'utf-8');

export function toBase64(str: string): string {
  return Buffer.from(str).toString('base64');
}

export function fromBase64(str: string): string {
  return Buffer.from(str, 'base64').toString('utf8');
}

export function createJWTToken(tokenPayload: any) {
  return jwtSimple.encode(tokenPayload, secretKey);
}

export function decodeJWTToken(token: string): any {
  return jwtSimple.decode(token, secretKey);
}

export function verifyOdontologistToken(token: string): core.TokenPayload {
  return verifyToken(token, 'odontologist');
}


export function verifyAdminToken(token: string): core.TokenPayload {
  return verifyToken(token, 'admin');
}

function verifyToken(token: string, sessionType: core.SessionType): core.TokenPayload {
  let tokenPayload;
  try {
    tokenPayload = jwtSimple.decode(token, secretKey) as core.TokenPayload;
  } catch (error) {
    throw new InvalidSessionError(token);
  }
  let expirationDate = moment(tokenPayload.expirationDate, 'YYYY-MM-DD');
  let today = moment();
  if (expirationDate.isBefore(today)) {
    throw new InvalidSessionError(token);
  }

  if (sessionType !== tokenPayload.type) {
    throw new InvalidSessionError(token);
  }
  return tokenPayload;
}
