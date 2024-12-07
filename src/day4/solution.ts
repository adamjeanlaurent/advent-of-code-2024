
import { readFileLines } from "../helpers";
import path = require("path");


// word search
// word can be
// - backwards
// - horizonal
// - vertical
// - diagonal
// - overlapping with other words ???
//
/*
    - find all the x's
    - at each x
        - check for XMAS
            - diagonal (bottom left, botton right)
            - vertical (down)
            - horizontal (right)
        - check for SAMX
            - diagonal (top left, top right)
            - vertical (up)
            - horizontal (left)
*/

async function solution() {
    let matches: number = 0;
    const ws: string[] = await readFileLines(path.join(__dirname, "input.txt"));

    for (let row = 0; row < ws.length; row++) {
        for (let col = 0; col < ws[0].length; col++) {
            if (ws[row][col] === 'A')
                matches += findMatchesV2(row, col, ws);
        }
    }

    console.log(matches);
}

class Cell {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

function findMatch(ws: string[], cells: Cell[]): number {
    // console.log(cells);

    let word: string = '';

    for (const cell of cells) {
        if (0 > cell.row || ws.length <= cell.row || 0 > cell.col || ws[0].length <= cell.col) {
            return 0;
        }

        word += ws[cell.row][cell.col];
    }

    if (word === 'MAS' || word === 'SAM') {
        return 1;
    }

    return 0;
}

function findMatchesV2(row: number, col: number, ws: string[]): number {
    const xmas_diagonal_left: Cell[] = [
        new Cell(row - 1, col - 1),
        new Cell(row, col),
        new Cell(row + 1, col + 1),
    ];

    const xmas_diagonal_right: Cell[] = [
        new Cell(row - 1, col + 1),
        new Cell(row, col),
        new Cell(row + 1, col - 1),
    ];

    if ((findMatch(ws, xmas_diagonal_left) + findMatch(ws, xmas_diagonal_right)) === 2) {
        return 1;
    }

    return 0;
}


function findMatches(row: number, col: number, ws: string[]): number {
    // find XMAS
    const xmas_vertical_down: Cell[] = [
        new Cell(row, col),
        new Cell(row - 1, col),
        new Cell(row - 2, col),
        new Cell(row - 3, col),
    ];

    const xmas_horizonal_right: Cell[] = [
        new Cell(row, col),
        new Cell(row, col + 1),
        new Cell(row, col + 2),
        new Cell(row, col + 3),
    ];

    const xmas_diagonal_left_down: Cell[] = [
        new Cell(row, col),
        new Cell(row - 1, col - 1),
        new Cell(row - 2, col - 2),
        new Cell(row - 3, col - 3),
    ];

    const xmas_diagonal_right_down: Cell[] = [
        new Cell(row, col),
        new Cell(row - 1, col + 1),
        new Cell(row - 2, col + 2),
        new Cell(row - 3, col + 3),
    ];

    const xmas_vertical_up: Cell[] = [
        new Cell(row, col),
        new Cell(row + 1, col),
        new Cell(row + 2, col),
        new Cell(row + 3, col),
    ];

    const xmas_horizonal_left: Cell[] = [
        new Cell(row, col),
        new Cell(row, col - 1),
        new Cell(row, col - 2),
        new Cell(row, col - 3),
    ];

    const xmas_diagonal_left_up: Cell[] = [
        new Cell(row, col),
        new Cell(row + 1, col - 1),
        new Cell(row + 2, col - 2),
        new Cell(row + 3, col - 3),
    ];

    const xmas_diagonal_right_up: Cell[] = [
        new Cell(row, col),
        new Cell(row + 1, col + 1),
        new Cell(row + 2, col + 2),
        new Cell(row + 3, col + 3),
    ];

    return (
        findMatch(ws, xmas_vertical_up) +
        findMatch(ws, xmas_vertical_down) +
        findMatch(ws, xmas_horizonal_left) +
        findMatch(ws, xmas_horizonal_right) +
        findMatch(ws, xmas_diagonal_left_up) +
        findMatch(ws, xmas_diagonal_right_up) +
        findMatch(ws, xmas_diagonal_left_down) +
        findMatch(ws, xmas_diagonal_right_down)
    );
}

solution();
