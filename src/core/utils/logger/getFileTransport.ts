import { transports } from 'winston';

export function fileTransport() {
    return new transports.File({
        level: 'error',
        filename: './log/log.txt',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        name: 'file',
        silent: true
    });
}
