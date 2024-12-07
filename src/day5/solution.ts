


// given rules
// n1|n2 -> means that in an update, n1 must come before n2
// given updates
// 1 line = 1 update
// check udpate against rules to see if follows
// get middle number of update
// add all middle numbers up

import path from "path";
import { Nullable, readFileLines, readFileWhole, swapElements } from "../helpers";

/*
 
 for (x) {
    numberThatIfExistMustComeBeforeX = [...]
    numberThatIfExistMustComeAfterX = [...]
    
    for (..before x) {
        if (numberThatIfExistMustComeAfterX.has(x)) {
            nooooo
        }
    }

    for (..after x) {
        if (numberThatIfExistMustComeBeforeX.has(x)) {
            nooooo
        }
    }
 }

 yeesss
 */

class Rules {
    before: Set<number> = new Set();
    after: Set<number> = new Set();
}

function parseRules(rules: string[]): Map<number, Rules> {
    const orderingRules: Map<number, Rules> = new Map();

    for (const rule of rules) {
        let nums: string[] = rule.split('|');
        const before: number = Number(nums[0]);
        const after: number = Number(nums[1]);

        if (orderingRules.has(before)) {
            orderingRules.get(before)!.after.add(after);
        }
        else {
            let r: Rules = new Rules();
            r.after.add(after);
            orderingRules.set(before, r);
        }

        if (orderingRules.has(after)) {
            orderingRules.get(after)!.before.add(before);
        }
        else {
            let r: Rules = new Rules();
            r.before.add(before);
            orderingRules.set(after, r);
        }
    }

    return orderingRules;
}

async function solution() {
    const lines: string[] = await readFileLines(path.join(__dirname, "input.txt"))
    const ruleStrings: string[] = [];
    const pages: Array<string[]> = [];

    let res: number = 0;

    for (const line of lines) {
        if (line.includes('|'))
            ruleStrings.push(line);
        else if (line.length > 0)
            pages.push(line.split(','));
    }

    const rules: Map<number, Rules> = parseRules(ruleStrings);

    console.log(rules);
    console.log(pages);

    console.log('==============================');

    let pageNum: number = -1;

    for (const page of pages) {
        let cycles: number = 0;
        pageNum++;
        let perc: number = Math.floor((pageNum / pages.length) * 100);
        console.log(`${perc}%`);

        // console.log(page);
        let updated: boolean = false;

        for (let i = 0; i < page.length; i++) {
            cycles++;

            const rulesForNum: Nullable<Rules> = rules.get(Number(page[i]));

            if (!rulesForNum)
                continue;

            // check before rules
            for (let j = 0; j < i; j++) {
                if (rulesForNum.after.has(Number(page[j]))) {
                    // console.log(`index: ${pageNum} ${page} is invalid! ${page[j]} cannot come before ${page[i]}`);

                    // const temp: string = page[j];
                    // page.splice(j, 1);
                    // page.push(temp);
                    // page.splice(i + 1, 0, temp);

                    // shuffleArray(page);
                    swapElements(page, i, j);
                    i = 0;
                    updated = true;
                    continue;
                }
            }

            // check after rules
            for (let j = page.length - 1; j > i; j--) {
                if (rulesForNum.before.has(Number(page[j]))) {
                    // console.log(`index: ${pageNum} ${page} is invalid! ${page[j]} cannot come after ${page[i]}`);

                    // const temp: string = page[j];
                    // page.splice(j, 1);
                    // page.splice(i - 1, 0, temp);
                    // page.unshift(temp);
                    // shuffleArray(page);

                    swapElements(page, i, j);
                    i = 0;
                    updated = true;
                    continue;
                }
            }
        }

        if (updated) {
            res += Number(page[Math.floor(page.length / 2)]);
        }

        console.log(`cycles: ${cycles}`);

        // console.log(`${ page } is valid! middle val: ${ page[Math.floor(page.length / 2)]}`);
    }

    console.log(res);
}


solution();
