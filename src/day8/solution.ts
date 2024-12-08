import path from "path";
import { isAlphanumeric, measureRuntime, Nullable, readFileLinesV2, Point, MyProgressBar, printMatrix, newInvalidPoint } from "../helpers";

// frequency: 
//
//      an antena playing a certain frequency.
//      (lowercase letter, uppercase letter, or digit).
//      only applies effects at antinodes.
//
// antinodes: 
//      occurs at any point that is perfectly in line with two antennas of the same frequency. (idk what in-line means?)
//          but only when one of the antennas is twice as far away as the other.
//      This (apprently?) means that for any pair of antennas with the same freqency there are 2 anti nodes on either side of them.

// for every antenna pair, draw a line between then
// capture how far (in terms of the line they are from each other) N, draw 2 antinodes on start of line - N and end of line + N

// 2 points are always colinear, a line can always be drawn
// point (x1,y1) and (x2,y2). they have an x and y difference, (xd, yd) anti node will do at (x1 - xd, y1 - yd) and (x2 - xd, y2 - yd).
// non-visible ones don't count.


function getAntennasByFrequency(lines: string[][]): Map<string, Point[]> {
    let res: Map<string, Point[]> = new Map();

    for (let row = 0; row < lines.length; row++) {
        for (let col = 0; col < lines[0].length; col++) {
            if (isAlphanumeric(lines[row][col])) {
                const char: string = lines[row][col];

                if (res.has(char)) {
                    res.get(char)!.push(new Point(row, col));
                }
                else {
                    res.set(char, [new Point(row, col)]);
                }
            }
        }
    }

    return res;
}


function connectPoints(antinodes: Set<string>, antennas: Point[], lines: string[][]) {
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const x1: number = antennas[i].x;
            const y1: number = antennas[i].y;
            const x2: number = antennas[j].x;
            const y2: number = antennas[j].y;

            const xDiff: number = Math.abs(x1 - x2);
            const yDiff: number = Math.abs(y1 - y2);

            // one point will get the -
            // one point will get the +
            // left and right matter here and up and down
            //

            let a1: Point = newInvalidPoint();
            let a2: Point = newInvalidPoint();

            if (x1 > x2) {
                // p1 is lowest
                a1.x = x1 + xDiff;
                a2.x = x2 - xDiff;
            }
            else if (x1 < x2) {
                // p2 is highest
                a1.x = x1 - xDiff;
                a2.x = x2 + xDiff;
            }

            // highest one is -
            // lowest one is +

            if (y1 > y2) {
                // p1 is right most
                a1.y = y1 + yDiff;
                a2.y = y2 - yDiff;
            }
            else if (y1 < y2) {
                // p2 is left most
                a1.y = y1 - yDiff;
                a2.y = y2 + yDiff;
            }

            // console.log(` antenna 1 = ${antennas[i].stringify()} | antenna 2 = ${antennas[j].stringify()} | xdiff: ${xDiff} | ydiff: ${yDiff} | antinode 1 = ${a1.stringify()} | antinode 2 = ${a2.stringify()}`);

            if (a1.isValid()) {
                // check bounds
                if (a1.isInBounds(lines)) {

                    antinodes.add(a1.stringify());

                    if (!isAlphanumeric(lines[a1.x][a1.y])) {
                        lines[a1.x][a1.y] = '#';
                    }
                }
            }

            if (a2.isValid()) {
                // check bounds
                if (a2.isInBounds(lines)) {

                    antinodes.add(a2.stringify());

                    if (!isAlphanumeric(lines[a2.x][a2.y])) {
                        lines[a2.x][a2.y] = '#';
                    }
                }
            }
        }

    }
}

async function part1() {
    const lines: string[][] = await readFileLinesV2(path.join(__dirname, "input.txt"));
    const antennas: Map<string, Point[]> = getAntennasByFrequency(lines);
    const antinodes: Set<string> = new Set();

    // console.log(antennas);

    let progress: MyProgressBar = new MyProgressBar(antennas.size);

    for (const [_, points] of antennas.entries()) {
        connectPoints(antinodes, points, lines);
        progress.Tick();
    }

    // printMatrix(lines);

    console.log(antinodes.size);
}

measureRuntime(part1);
