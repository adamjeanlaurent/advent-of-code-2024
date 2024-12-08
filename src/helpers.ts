import * as fs from 'fs';
import ProgressBar from 'progress';
import * as readline from 'readline';

export type Nullable<T> = T | null | undefined;

export async function readFileLines(filepath: string): Promise<string[]> {
    let lines: string[] = [];
    const fileStream: fs.ReadStream = fs.createReadStream(filepath);

    const rl: readline.Interface = readline.createInterface({
        input: fileStream,
    });

    for await (const line of rl) {
        lines.push(line);
    }

    return lines;
}

export async function readFileLinesV2(filepath: string): Promise<string[][]> {
    let lines: string[][] = [];
    const fileStream: fs.ReadStream = fs.createReadStream(filepath);

    const rl: readline.Interface = readline.createInterface({
        input: fileStream,
    });

    for await (const line of rl) {
        lines.push(line.split(''));
    }

    return lines;
}

export async function readFileWhole(filepath: string): Promise<string> {
    let wholeFile: string = '';
    const fileStream: fs.ReadStream = fs.createReadStream(filepath);

    const rl: readline.Interface = readline.createInterface({
        input: fileStream,
    });

    for await (const line of rl) {
        wholeFile += line;
    }

    return wholeFile;
}

export interface RegExMatch {
    match: string,
    index: number
}

export function findAllRegexMatches(pattern: RegExp, str: string): RegExMatch[] {
    const regex: RegExp = new RegExp(pattern, 'g');
    const matches: RegExMatch[] = [];
    let match: Nullable<RegExpExecArray>;

    while ((match = regex.exec(str)) !== null) {
        matches.push({
            match: match[0],
            index: match.index
        });
    }

    return matches;
}

export function swapElements<T>(array: T[], idxA: number, idxB: number) {
    [array[idxA], array[idxB]] = [array[idxB], array[idxA]];
}

export function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index
        const j = Math.floor(Math.random() * (i + 1));

        swapElements(array, i, j);
    }
    return array;
}

export function percentDone(numer: number, denom: number): string {
    const percent: number = (numer / denom) * 100;
    return (`${Math.floor(percent)}%`);
}

export class MyProgressBar {
    private pb: ProgressBar;

    constructor(total: number) {
        this.pb = new ProgressBar(':bar :percent :elapsed seconds', { total: total, width: 50 });
    }

    public Tick() {
        this.pb.tick();
    }
}

export async function measureRuntime(callback: () => Promise<void>) {
    const start: any = new Date();
    await callback();
    const end: any = new Date();

    const diffMs = end - start; // Difference in milliseconds
    const diffSec = Math.floor(diffMs / 1000); // Total seconds
    const minutes = Math.floor(diffSec / 60); // Extract minutes
    const seconds = diffSec % 60; // Remaining seconds
    const milliseconds = diffMs % 1000; // Remaining milliseconds

    console.log(
        `Elapsed time: minutes: ${minutes} | seconds: ${seconds < 10 ? "0" : ""}${seconds} | milliseconds: ${milliseconds < 100 ? "0" : ""
        }${milliseconds < 10 ? "0" : ""}${milliseconds}`
    );
}

export function isAlphanumeric(str: string) {
    return /^[a-z0-9]+$/i.test(str);
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    stringify(): string {
        return `${this.x}:${this.y}`;
    }

    isInBounds<T>(matrix: T[][]): boolean {
        return (this.x >= 0 && this.x < matrix.length && this.y >= 0 && this.y < matrix[0].length);
    }

    isValid(): boolean {
        return (this.x != Infinity && this.y != Infinity);
    }
}

export function newInvalidPoint(): Point {
    return new Point(Infinity, Infinity);
}

export function printMatrix(lines: string[][]) {
    for (const line of lines) {
        console.log(line.toString().replace(/,/g, ''));
    }
}
