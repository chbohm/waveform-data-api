import * as fs from 'fs';
import { FileNotFoundError } from '../errors/errors';

export function capitalizeFirstLetter(str: string) {
  if (str === undefined) {
    return str;
  }

  if (str.indexOf('.') !== -1) {
    return str.split('.').map(capitalizeFirstLetter).join('.');
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeFirstLetterObject(obj: any) {
  if (obj === undefined || obj === null || typeof (obj) !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    let newArray = [];
    Object.keys(obj).forEach(key => {
      newArray.push(capitalizeFirstLetterObject(obj[key]));
    });
    return newArray;
  }

  let newObject = {};
  for (var key in obj) {
    if (typeof obj[key] !== 'function') {
      newObject[capitalizeFirstLetter(key)] = capitalizeFirstLetterObject(obj[key]);
    }
  }
  return newObject;
}

export function loadFile(file: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.exists(file, (exists) => {
      if (exists) {
        fs.readFile(file, { encoding: 'utf8' }, (error: Error, data: string) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        });
      } else {
        return reject(new FileNotFoundError(file));
      }
    });
  });
}
