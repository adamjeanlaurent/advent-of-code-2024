import path from "path";
import { measureRuntime, MyProgressBar, readFileLinesV2, stringifyCell, stringMatrixToNumberMatrix } from "../helpers";

// input is topographic map
// each spot indicates a height (0-9)
// a good hiking trail = as long as possible, and has an even, gradual, uphill slope
//      i.e any path that starts at height 0, ends at height 9, and always increase +1 at each step
// trails only include up, down, left, right movements (no diagaonal)
// trailhead = position that starts 1 to N trails (obviously has the value 0)
// trailhead's score = number of trails at that spot (i.e that are good hiking trails)
// take in a hiking trail
// return score of all trailheads summed



const dirs: [number, number][] = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
];

function dfs(tMap: number[][], curRow: number, curCol: number, valToFind: number): number {
    let score: number = 0;

    for (const dir of dirs) {
        const newRow: number = curRow + dir[0];
        const newCol: number = curCol + dir[1];

        if (newRow >= 0 && newRow < tMap.length && newCol >= 0 && newCol < tMap[0].length) {
            if (tMap[newRow][newCol] === valToFind) {
                if (valToFind === 9) {
                    score++;
                }
                else {
                    score += dfs(tMap, newRow, newCol, valToFind + 1);
                }
            }
        }
    }

    return score;
}

async function part1() {
    let lines: string[][] = await readFileLinesV2(path.join(__dirname, "input.txt"));
    let tMap: number[][] = stringMatrixToNumberMatrix(lines);
    let score: number = 0;


    let pb: MyProgressBar = new MyProgressBar(tMap.length * tMap[0].length);

    for (let row = 0; row < tMap.length; row++) {
        for (let col = 0; col < tMap[0].length; col++) {
            pb.Tick();
            if (tMap[row][col] === 0) {
                const seen: Set<string> = new Set();
                let goodTrails: number = dfs(tMap, row, col, 1);
                score += goodTrails;
            }
        }
    }

    console.log(score);
}

measureRuntime(part1);
