import path from "path";
import { isAlphanumeric, measureRuntime, readFileWhole, swapElements } from "../helpers";

// disk map represents files and free space
// 12345 => 1 block file, 2 free blocks, 3 block file, 4 free blocks, 5 block file
// each file has an ID based on the order of files before reordering
// 12345 => 1 block file with ID 0, 3 block file with ID 1, 5 block file with ID 2
// you can represent the map with . for empty blocks, and the file ID repeated for the number of blocks
// 12345 => 0..111....22222
// 0 free spaces means no period, but the number will change


// 1. move file blocks from the end of the disk to the next available free block until there are no gaps
// 2. calculate checksum. for each block muliply it's position by the file ID
//      ex. 12345 = 0..111....22222 = 022222111...... = 0 * 0 + 2 * 1 + 2 * 2 .....

/*
   blocks = [0, null, null, 1, 1, 1, null, null, null, null, 2, 2, 2, 2] 
   blocks = [0, 2, 2, 2, 2, 2, 1, 1, 1, null, null, null, null, null] 
*/
function expandDiskMap(diskMap: string): number[] {
    let expandedDiskMap: number[] = [];
    let nextFileId: number = 0;

    for (let i = 0; i < diskMap.length; i++) {
        if (i % 2 === 0) {
            // file block

            for (let j = 0; j < Number(diskMap[i]); j++) {
                expandedDiskMap.push(nextFileId);
            }

            nextFileId++;
        }
        else {
            // free block
            //
            for (let j = 0; j < Number(diskMap[i]); j++) {
                expandedDiskMap.push(-1);
            }
        }
    }

    return expandedDiskMap;
}

function compressDiskMap(expandedDiskMap: number[]) {
    let left: number = 0;
    let right: number = expandedDiskMap.length - 1;

    while (left < right) {

        // move left to free space
        while (expandedDiskMap[left] !== -1) {
            left++;
        }

        // move right to a number
        while (expandedDiskMap[right] === -1) {
            right--;
        }

        // re-check bounds just in case
        if (left >= right) {
            break;
        }

        swapElements(expandedDiskMap, left, right);
    }
}

function compressDiskMapV2(expandedDiskMap: number[]) {
    let left: number = 0;
    let right: number = expandedDiskMap.length - 1;

    while (left < right) {
        // move left to start of free space
        // while (expandedDiskMap[left] !== -1) {
        //     left++;
        // }

        // move right to a number
        while (expandedDiskMap[right] === -1) {
            right--;
        }

        // re-check bounds just in case
        if (left >= right) {
            break;
        }

        // get size of free space
        // let freeSpaceSize: number = 0;
        // let temp = left;
        // while (temp < expandedDiskMap.length && expandedDiskMap[temp] === -1) {
        //     temp++;
        //     freeSpaceSize++;
        // }

        // get size of file
        let fileSize: number = 0;
        let temp = right;
        while (temp >= 0 && expandedDiskMap[temp] === expandedDiskMap[right]) {
            temp--;
            fileSize++;
        }

        // find left most free space large enough for file
        temp = left;
        let couldMoveFile: boolean = false;

        while (left < expandedDiskMap.length && expandedDiskMap[left] !== -1) {
            left++;

            let temp: number = left;
            let freeSpaceSize: number = 0;

            while (temp < expandedDiskMap.length && expandedDiskMap[temp] === -1) {
                temp++;
                freeSpaceSize++;
            }


            // if there is space to move whole file, move it
            if (fileSize <= freeSpaceSize) {
                console.log(`could move ${expandedDiskMap[right]}`);
                console.log(fileSize, freeSpaceSize);
                for (let i = 0; i < fileSize; i++) {
                    swapElements(expandedDiskMap, left, right);
                    left++;
                    right--;
                }
                couldMoveFile = true;
                break;
            }

        }

        // if there isn't enough space, move right to next file block
        if (!couldMoveFile) {
            console.log(`could NOT move ${expandedDiskMap[right]}`);
            console.log(fileSize);
            right = right - fileSize;
        }

        left = 0;
    }

}

function sumCompressedDiskMap(compressedDiskMap: number[]): number {
    let i: number = 0;
    let checksum: number = 0;

    while (i < compressedDiskMap.length && compressedDiskMap[i] !== -1) {
        checksum += compressedDiskMap[i] * i;
        i++;
    }

    return checksum;
}

async function part1() {
    const diskMap: string = await readFileWhole(path.join(__dirname, "input.txt"));
    const expandedDiskMap: number[] = expandDiskMap(diskMap);
    compressDiskMap(expandedDiskMap);
    const compactDiskMap: number[] = expandedDiskMap;
    const checksum: number = sumCompressedDiskMap(compactDiskMap);
    console.log(checksum);
}

async function part2() {
    const diskMap: string = await readFileWhole(path.join(__dirname, "debug.txt"));
    const expandedDiskMap: number[] = expandDiskMap(diskMap);
    console.log(expandedDiskMap.join('').replace(/-1/g, '.'));
    compressDiskMapV2(expandedDiskMap);
    const compactDiskMap: number[] = expandedDiskMap;
    console.log(compactDiskMap.join('').replace(/-1/g, '.'));
    const checksum: number = sumCompressedDiskMap(compactDiskMap);
    console.log(checksum);
}


part2();

