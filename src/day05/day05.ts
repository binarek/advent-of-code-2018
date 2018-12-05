import _ = require("lodash");
import common = require("../common");

export function part1(): number {
    return reactPolymer(readPolymer()).length;
}

export function part2(): number {
    const polymer = readPolymer();
    let minLength = polymer.length;

    for (const type of String.fromCharCode(..._.range("a".charCodeAt(0), "z".charCodeAt(0) + 1))) {
        const modifiedPolymer = polymer.replace(new RegExp(type, "gi"), "");
        if (modifiedPolymer.length < polymer.length) {
            const length = reactPolymer(modifiedPolymer).length;
            if (length < minLength)  {
                minLength = length;
            }
        }
    }
    return minLength;
}

function readPolymer(): string {
    return common.readInput(__dirname)[0];
}

function reactPolymer(polymer: string): string {
    let changeFound: boolean;
    do {
        changeFound = false;
        for (let i = polymer.length - 2; i >= 0; i -= 1) {
            if (polymer[i] !== polymer[i + 1] && polymer[i].toUpperCase() === polymer[i + 1].toUpperCase()) {
                changeFound = true;
                polymer = polymer.substring(0, i) + polymer.substring(i + 2);
                if (i === polymer.length) {
                    i -= 1;
                }
            }
        }
    } while (changeFound);
    return polymer;
}
