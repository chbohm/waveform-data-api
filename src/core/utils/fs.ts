import * as fs from 'fs';

export async function exists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.exists(path, (exists) => {
            return resolve(exists);
        });
    });
}


export async function mkdir(path: fs.PathLike, options: number | string | undefined | null): Promise<NodeJS.ErrnoException | null> {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, options, (error: NodeJS.ErrnoException | null) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

export async function writeFile(path: fs.PathLike, data: any, options: any): Promise<NodeJS.ErrnoException | null> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, (error: NodeJS.ErrnoException | null) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

export async function readFile(path: fs.PathLike | number, options: { encoding: string; flag?: string; } | string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (error: NodeJS.ErrnoException | null, data: string) => {
            if (error) {
                return reject(error);
            }
            resolve(data);
        });
    });
}
