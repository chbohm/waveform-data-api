import * as bodyParser from 'body-parser';
import * as signature from '../core/utils/signature';

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



