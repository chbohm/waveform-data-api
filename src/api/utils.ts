import * as bodyParser from 'body-parser';
import * as config from 'config';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as unzip from 'unzip';
import * as path from 'path';
import * as shelljs from 'shelljs';


const BodyParser = bodyParser.json({
    limit: '10mb'
});

export function getBody(req: endpoint.IRequest) {
    return new Promise(function (resolve: Function, reject: Function) {
        if (req.body !== undefined) {
            resolve(req.body);
        } else {
            BodyParser(req, null, function (err: any) {
                if (err) {
                    reject(err);
                } else {
                    resolve(req.body);
                }
            });
        }
    });
}


function getHeader<T>(headers: core.Dictionary<string>, key: string): string;
function getHeader<T>(headers: core.Dictionary<string>, key: string, transformer: (val: any) => T): T;
function getHeader(headers: core.Dictionary<string>, key: string, transformer?: Function): any {
    return transformer ? transformer(headers[key]) : headers[key];
}




let downloadDir = config.get('download_dir');


export function inferFileName(url: string) {
    let urlWithoutParams = url.split('?')[0];
    let parts = urlWithoutParams.split('/');
    return parts[parts.length - 1];
}

export function hasZipExtension(fileName: string) {
    return fileName.endsWith('zip');
}

/**
 * @param zipFile
 * @returns the path to the folder with unzipped content
 */
export async function unzipFile(zipFile: string): Promise<string> {
    zipFile = path.resolve(zipFile);
    log('Unziping' + zipFile);
    let result: Promise<string> = new Promise((resolve, reject) => {
        let unzippedFolder = zipFile.substring(0, zipFile.length - 4);
        let stream = fs.createReadStream(zipFile);
        stream.on('close', () => {
            log('Unzipped in ' + unzippedFolder);
            resolve(unzippedFolder);
        });
        stream.on('error', (error) => reject(error));
        stream.pipe(unzip.Extract({ path: unzippedFolder }));
    });
    return result;
}

export function getFirstFileInFolder(folder: string) {
    let files: string[] = fs.readdirSync(folder);
    for (let i = 0; i < files.length; i++) {
        let file = path.resolve(folder, files[i]);
        console.log(file);
        if (fs.lstatSync(file).isFile()) {
            return file;
        }
    }
    return null;
}

export async function cleanFolder(folder: string) {
    shelljs.rm('-rf', folder);
    fs.mkdirSync(folder);
}

export function removeFiles(files: string[]) {
    files.forEach(file => {
        shelljs.rm('-rf', file);
    });
}

export async function download(url: string, targetFileName: string): Promise<string> {
    let promise: Promise<string> = new Promise((resolve, reject) => {
        log('Downloading file: ' + url);
        fetch(url).then((response) => {
            let writeStream = fs.createWriteStream(targetFileName);
            response.body.pipe(writeStream);
            writeStream.on('error', (error) => { reject(error); });
            writeStream.on('close', () => {
                log('file ' + url + ' downloaded');
                resolve(targetFileName);
            });
        }).catch((error) => {
            reject(error);
        });
    });
    return promise;
}

function log(message: string) {
    console.log(message);
}



