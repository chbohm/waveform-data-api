
import * as utils from '../../utils';

import * as config from 'config';

import fetch from 'node-fetch';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import * as ffmpeg from '@ffmpeg-installer/ffmpeg';
import * as ffprobe from '@ffprobe-installer/ffprobe';

const ffmpegPath = ffmpeg.path;
const ffprobePath = ffprobe.path;

let downloadDir = config.get('download_dir');
let filesOrDirsToRemove: string[] = [];


utils.cleanFolder(downloadDir);

setInterval(() => {

    utils.removeFiles(filesOrDirsToRemove);
    filesOrDirsToRemove = [];
}, 1000);

export let generateWeaveForm: endpoint.Definition = {
    id: 'pepe',
    endpoint: {
        method: 'POST',
        path: '/generate-waveform'
    },
    // req.body: ConsultationQuery
    callback: async (request: endpoint.IRequest, response: endpoint.IResponse, nextFunction: endpoint.INextFunction) => {

        let body = await utils.getBody(request) as any;
        // console.log(body)
        if (!body || !body.audio_url || !Number.isInteger(body.samples) || !Array.isArray(body.fields)) {
            response.status(400);
            response.send(JSON.stringify({
                error: 'Invalid request, request body should look like this: {"audio_url": "https://link.to/sound.wav", "samples": 1000, "fields": ["peaks", "info"]}'
            }));
            return;
        }
        const url = body.audio_url;
        const samples: number = body.samples;
        const fields: string[] = body.fields;
        const samplesPerSample: number = body.samplesPerSample || 5;
        try {
            let fileName = utils.inferFileName(url);
            let downloadedFileName = await utils.download(url, path.resolve(downloadDir, fileName));
            console.log('download ready: ' + downloadedFileName);
            let downloadedAudioFile = downloadedFileName;
            let unzippedFolder;
            if (utils.hasZipExtension(downloadedFileName)) {
                unzippedFolder = await utils.unzipFile(downloadedFileName);
                log('Searching unzipped audio file in: ' + unzippedFolder);
                downloadedAudioFile = utils.getFirstFileInFolder(unzippedFolder);
                log('Audio File ' + downloadedAudioFile);
            }


            let data = await fileToWaveform(downloadedAudioFile, samples, samplesPerSample);

            filesOrDirsToRemove.push(downloadedFileName);
            filesOrDirsToRemove.push(unzippedFolder);

            const save: any = {};
            Object.keys(data).forEach(key => {
                save[key] = JSON.stringify(data[key]);
            });
            const result: any = {};
            fields.forEach(field => {
                result[field] = data[field];
            });
            response.send(JSON.stringify(result));
        } catch (err) {
            response.status(400);
            response.send(err.message);
        }
    }
};



function log(obj: any) {
    console.log(JSON.stringify(obj, null, 2));
}




// function downsample(numbers: number[], targetLength: number) {
//     const pairs = numbers.map((number, i) => [i, number])
//     return downsampler.processData(pairs, targetLength)
//         .map((pair: [number, number]) => pair[1])
// }

function probeJson(file: string) {
    return new Promise((resolve, reject) => {
        const ffprobe = spawn(ffprobePath, ['-i', file, '-v', 'quiet', '-select_streams', 'a:0', '-print_format', 'json', '-show_format', '-show_streams', '-hide_banner']);
        const bufs: Buffer[] = [];
        const errBufs: Buffer[] = [];
        ffprobe.stdout.on('data', (data) => {
            bufs.push(data as Buffer);
        });
        ffprobe.stderr.on('data', (data) => {
            errBufs.push(data as Buffer);
        });
        ffprobe.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`ffprobe exited with code: ${code}, stderr: ${Buffer.concat(errBufs).toString()}`));
                return;
            }
            const ffprobeData = JSON.parse(Buffer.concat(bufs).toString());
            resolve(ffprobeData);
        });
    });
}

function ffmpegBuffer(file: string, sampleRate: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, ['-i', file, '-ac', '1', '-filter:a', 'aresample=' + sampleRate, '-map', '0:a', '-c:a', 'pcm_s16le', '-f', 'data', '-']);
        const bufs: Buffer[] = [];
        const errBufs: Buffer[] = [];
        ffmpeg.stdout.on('data', (data) => bufs.push(data as Buffer));
        ffmpeg.stderr.on('data', (data) => errBufs.push(data as Buffer));
        ffmpeg.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`ffmpeg exited with code: ${code}, stderr: ${Buffer.concat(errBufs).toString()}`));
                return;
            }
            resolve(Buffer.concat(bufs));
        });
    });
}

function bufferToPeaks(buffer: Buffer, length: number, samplesPerSample: number) {
    const waves = [];
    let totalMax = -Infinity;
    const steps = Math.floor(buffer.length / length) || 1;
    for (var i = 0; i < buffer.length - steps; i += steps) {
        let max = 0;
        for (var j = 0; j < Math.min(steps, samplesPerSample); j++) {
            const value = Math.abs(buffer.readInt16LE(i + j));
            if (value > max) {
                max = value;
            }
        }
        waves.push(max);
        if (max > totalMax) {
            totalMax = max;
        }
    }
    return waves.map(wave => Math.round((wave / totalMax) * 10000) / 10000);
}


async function fileToWaveform(file: string, samples: number, samplesPerSample: number): Promise<any> {

    const ffprobeData: any = await probeJson(file);
    const sampleRate = Math.round(Math.max(samples / ffprobeData.format.duration, 800));
    const ffmpegData = await ffmpegBuffer(file, sampleRate);
    fs.unlinkSync(file);
    const peaks = bufferToPeaks(ffmpegData, samples, samplesPerSample);
    return {
        info: ffprobeData,
        peaks
    };
}



async function urlToWaveform(url: string, samples: number, samplesPerSample: number): Promise<any> {
    let res = await fetch(url);

    return new Promise((resolve, reject) => {

        const tmpFile = './tmp/wave.json';
        const writeStream = fs.createWriteStream(tmpFile);
        res.body.pipe(writeStream);
        writeStream.on('error', reject);
        writeStream.on('close', async () => {
            try {
                console.log('Closing');
                const ffprobeData: any = await probeJson(tmpFile);
                const sampleRate = Math.round(Math.max(samples / ffprobeData.format.duration, 800));
                const ffmpegData = await ffmpegBuffer(tmpFile, sampleRate);
                fs.unlinkSync(tmpFile);
                const peaks = bufferToPeaks(ffmpegData, samples, samplesPerSample);
                resolve({
                    info: ffprobeData,
                    peaks
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}



