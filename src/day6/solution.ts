
/*
    # = obstruction
    if there is obstruction is in front of you, turn right 90 degrees.
    Otherwise, take a step forward.
    the guard leaves the area when it walks out of an edge.
    return the number of distinct spots visited.
*/

import path from "path";
import { measureRuntime, Nullable, percentDone, readFileLinesV2 } from "../helpers";

enum Direction {
    up,
    down,
    left,
    right
}

const directionToString: Map<Direction, string> = new Map();
directionToString.set(Direction.up, "up");
directionToString.set(Direction.down, "down");
directionToString.set(Direction.left, "left");
directionToString.set(Direction.right, "right");

function changeDirection(currentDir: Direction): Direction {
    switch (currentDir) {
        case Direction.up:
            return Direction.right;
        case Direction.down:
            return Direction.left;
        case Direction.left:
            return Direction.up;
        case Direction.right:
            return Direction.down;
    }
}

function nextLocation(gl: GuardLocation): [number, number] {
    switch (gl.dir) {
        case Direction.up:
            return [gl.row - 1, gl.col];
        case Direction.down:
            return [gl.row + 1, gl.col];
        case Direction.left:
            return [gl.row, gl.col - 1];
        case Direction.right:
            return [gl.row, gl.col + 1];
    }
}

const block: string = '#';

class GuardLocation {
    row: number;
    col: number;
    dir: Direction;

    constructor(row: number, col: number, dir: Direction) {
        this.row = row;
        this.col = col;
        this.dir = dir;
    }
}

function stringify(row: number, col: number, dir: Direction) {
    return `${row}:${col}:${directionToString.get(dir)}`;
}

enum MoveResult {
    End,
    KeepGoing,
    Loop
}

function moveGuard(maze: string[][], gl: GuardLocation, seen: Set<string>): MoveResult {
    let [newRow, newCol] = nextLocation(gl);
    // console.log(`next location ${newRow}:${newCol}`);

    // out of maze
    if (newRow < 0 || newRow >= maze.length || newCol < 0 || newCol >= maze[0].length) {
        // console.log('out of maze');
        return MoveResult.End;
    }

    // need change direction
    if (maze[newRow][newCol] === block) {
        // console.log('guard here, changing dir');
        gl.dir = changeDirection(gl.dir);
        // console.log(`next dir ${directionToString.get(gl.dir)}`);
        return MoveResult.KeepGoing;
    }

    if (seen.has(stringify(newRow, newCol, gl.dir))) {
        return MoveResult.Loop;
    }

    // move to new location
    seen.add(stringify(newRow, newCol, gl.dir));
    maze[newRow][newCol] = 'X';
    gl.row = newRow;
    gl.col = newCol;

    // console.log('=====================');
    // for (const line of maze) {
    //     console.log(line.toString());
    // }
    // console.log('=====================');

    return MoveResult.KeepGoing;
}

const guardToDirection: Map<string, Direction> = new Map();
guardToDirection.set('v', Direction.down);
guardToDirection.set('^', Direction.up);
guardToDirection.set('<', Direction.left);
guardToDirection.set('>', Direction.right);

function findGuardStart(maze: string[][]): Nullable<GuardLocation> {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[0].length; col++) {
            if (guardToDirection.has(maze[row][col])) {
                const dir: Direction = guardToDirection.get(maze[row][col])!;
                return new GuardLocation(row, col, dir);
            }
        }
    }

    return null;
}

async function part1() {
    const maze: string[][] = await readFileLinesV2(path.join(__dirname, "input.txt"));

    // for (const line of maze) {
    //     console.log(line.toString());
    // }

    const seen: Set<string> = new Set();
    let guard: GuardLocation = findGuardStart(maze)!;

    // console.log(`guard start row: ${guard.row}, guard start col: ${guard.col}, guard start dir: ${directionToString.get(guard.dir)}`);

    seen.add(stringify(guard.row, guard.col, guard.dir));
    maze[guard.row][guard.col] = 'X';

    while (moveGuard(maze, guard, seen) === MoveResult.KeepGoing) { }

    // for (const line of maze) {
    //     console.log(line.toString());
    // }

    console.log(seen.size);
}

async function part2() {
    const maze: string[][] = await readFileLinesV2(path.join(__dirname, "input.txt"));
    let res: number = 0;

    // for (const line of maze) {
    //     console.log(line.toString());
    // }

    let startGuard: GuardLocation = findGuardStart(maze)!;
    let startArrow: string = maze[startGuard.row][startGuard.col];

    // console.log(`guard start row: ${guard.row}, guard start col: ${guard.col}, guard start dir: ${directionToString.get(guard.dir)}`);

    maze[startGuard.row][startGuard.col] = 'X';
    let done: number = 0;

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[0].length; col++) {
            // percentDone(done, (maze.length * maze[0].length));
            done++;
            let guard: GuardLocation = structuredClone(startGuard);

            if (maze[row][col] === block || guardToDirection.has(maze[row][col]))
                continue;

            const seen: Set<string> = new Set();
            seen.add(stringify(guard.row, guard.col, guard.dir));

            maze[row][col] = block;
            let moveResult: MoveResult = MoveResult.KeepGoing;

            while (moveResult === MoveResult.KeepGoing) {
                moveResult = moveGuard(maze, guard, seen);
            }

            if (moveResult === MoveResult.Loop) {
                res++;
            }

            maze[row][col] = '.';
            maze[startGuard.row][startGuard.col] = startArrow;
        }
    }

    console.log(res);
}

measureRuntime(part2);
