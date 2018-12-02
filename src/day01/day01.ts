import common = require('../common');

export function part1(): number {
    return readChanges().reduce((c1, c2) => c1 + c2);
}

export function part2(): number {
    const changes = readChanges();
    const pastFrequencies = new Set<number>();
    let frequency = 0;
    let twiceFound = false;

    do {
        for (const change of changes) {
            if (pastFrequencies.has(frequency)) {
                twiceFound = true;
                break;
            }
            pastFrequencies.add(frequency);
            frequency += change;
        }
    } while (!twiceFound);
    return frequency;
}

function readChanges(): number[] {
    return common.readInput(__dirname).map(line => Number(line));
}
