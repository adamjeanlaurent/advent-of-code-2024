import path from "path";
import { readFileWhole, findAllRegexMatches, RegExMatch } from "../helpers";

async function solution() {
    let result: number = 0;

    const pattern: RegExp = /mul\(\d{1,3},\d{1,3}\)/g;
    const file: string = await readFileWhole(path.join(__dirname, "input.txt"));
    const mulMatches: RegExMatch[] = findAllRegexMatches(pattern, file);
    console.log(mulMatches);

    for (const mulMatch of mulMatches) {
        if (isMultEnabled(file, mulMatch.index)) {
            const openingBracket: number = mulMatch.match.indexOf('(');
            const closingBracket: number = mulMatch.match.indexOf(')');
            let numsString: string = mulMatch.match.substring(openingBracket + 1, closingBracket);
            let numsArray: string[] = numsString.split(',');

            result += (Number(numsArray[0]) * Number(numsArray[1]));
        }
    }

    console.log(result);
}

// finds closest previous do or dont
// if do found: enabled
// if dont found: disabled
// if none found: enabled
function isMultEnabled(file: string, multStartIndex: number): boolean {
    const trimmedFile: string = file.substring(0, multStartIndex);
    const dos: RegExMatch[] = findAllRegexMatches(/do\(\)/g, trimmedFile);
    const donts: RegExMatch[] = findAllRegexMatches(/don't\(\)/g, trimmedFile);

    if (dos.length === 0 && donts.length === 0) {
        return true;
    }

    else if (dos.length === 0 && donts.length > 0) {
        return false;
    }

    else if (dos.length > 0 && donts.length === 0) {
        return true;
    }

    const latestDoIndex: number = dos[dos.length - 1].index;
    const latestDontIndex: number = donts[donts.length - 1].index;

    return latestDoIndex > latestDontIndex;

}

solution();
