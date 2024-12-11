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
    row: number;
    col: number;

    constructor(x: number, y: number) {
        this.row = x;
        this.col = y;
    }

    stringify(): string {
        return `${this.row}:${this.col}`;
    }

    isInBounds<T>(matrix: T[][]): boolean {
        return (this.row >= 0 && this.row < matrix.length && this.col >= 0 && this.col < matrix[0].length);
    }

    isValid(): boolean {
        return (this.row != Infinity && this.col != Infinity);
    }

    left(): Point {
        return new Point(this.row, this.col - 1);
    }

    right(): Point {
        return new Point(this.row, this.col + 1);
    }

    up(): Point {
        return new Point(this.row - 1, this.col);
    }

    down(): Point {
        return new Point(this.row + 1, this.col);
    }

    diagonalUpLeft(): Point {
        return new Point(this.row - 1, this.col - 1);
    }

    diagonalUpRight(): Point {
        return new Point(this.row - 1, this.col + 1);
    }

    diagonalDownLeft(): Point {
        return new Point(this.row + 1, this.col - 1);
    }

    diagonalDownRight(): Point {
        return new Point(this.row + 1, this.col + 1);
    }

    inBoundCrossNeighbours<T>(matrix: T[][]): Point[] {
        let points: Point[] = [
            this.up(),
            this.down(),
            this.left(),
            this.right()
        ];

        return points.filter(point => point.isInBounds(matrix));
    }

    inBoundCrossAndDiagonalNeighbours<T>(matrix: T[][]): Point[] {
        let points: Point[] = [
            this.up(),
            this.down(),
            this.left(),
            this.right(),
            this.diagonalUpLeft(),
            this.diagonalUpRight(),
            this.diagonalDownLeft(),
            this.diagonalDownRight(),
        ];

        return points.filter(point => point.isInBounds(matrix));
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

export function stringMatrixToNumberMatrix(stringArray: string[][]): number[][] {
    return stringArray.map(row =>
        row.map(value => Number(value))
    );
}

export function stringifyCell(row: number, col: number) {
    return `${row}:${col}`
}
