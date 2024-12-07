
import path from "path";
import { measureRuntime, MyProgressBar, percentDone, readFileLines } from "../helpers";

// give n: n1 n2 n3 ...
// have operators * an +
// it's possible that 1 combo of operators will give you n
// add up all possible lines that give you n

function getAllOperatorCombos(count: number, combos: string[], currentStr: string, p2: boolean) {
    if (count <= 0) {
        return combos.push(currentStr);
    }

    getAllOperatorCombos(count - 1, combos, currentStr + '*', p2);
    getAllOperatorCombos(count - 1, combos, currentStr + '+', p2);
    if (p2)
        getAllOperatorCombos(count - 1, combos, currentStr + '$', p2);
}

function tryCombo(operators: string[], nums: number[]): number {
    let res: number = nums.shift()!;

    while (operators.length > 0 && nums.length > 0) {
        let op: string = operators.shift()!;
        let num: number = nums.shift()!;

        if (op === '*')
            res = res * num;
        else if (op === '+')
            res = res + num;
        else if (op === '$')
            res = Number(`${res}${num}`);
    }

    return res;
}

// part 1:
// dfs of all possible operator combo until one works (if it does):w

async function part1() {
    let res: number = 0;

    const lines: string[] = await readFileLines(path.join(__dirname, 'input.txt'));

    for (const line of lines) {
        let parts: string[] = line.split(':');
        let nums: string[] = parts[1].split(' ').slice(1);

        const goal: number = Number(parts[0]);
        let vals: number[] = nums.map((v) => { return Number(v) });

        let combos: string[] = [];
        getAllOperatorCombos(vals.length - 1, combos, '', false);

        for (const combo of combos) {
            const calc: number = tryCombo(combo.split(''), structuredClone(vals));
            // console.log(`goal: ${goal} | nums: ${nums} | ops: ${combo} | calc: ${calc}`);
            if (calc === goal) {
                res += goal;
                break;
            }
        }
    }

    console.log(res);
}

async function part2() {
    let res: number = 0;

    const lines: string[] = await readFileLines(path.join(__dirname, 'input.txt'));
    let steps: number = 0;

    let pb: MyProgressBar = new MyProgressBar(lines.length);

    for (const line of lines) {
        pb.Tick();

        steps++;
        let parts: string[] = line.split(':');
        let nums: string[] = parts[1].split(' ').slice(1);

        const goal: number = Number(parts[0]);
        let vals: number[] = nums.map((v) => { return Number(v) });

        let combos: string[] = [];
        getAllOperatorCombos(vals.length - 1, combos, '', true);

        for (const combo of combos) {
            const calc: number = tryCombo(combo.split(''), structuredClone(vals));
            // console.log(`goal: ${goal} | nums: ${nums} | ops: ${combo} | calc: ${calc}`);
            if (calc === goal) {
                res += goal;
                break;
            }
        }
    }

    console.log(res);
}

measureRuntime(part2);
