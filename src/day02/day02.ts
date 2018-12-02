import common = require('../common');

export function part1(): number {
    const sums = common.readInput(__dirname)
        .map(id => {
            const occurrenceMap = new Map<string, number>();
            for (const c of id) {
                const occurence = occurrenceMap.get(c);
                occurrenceMap.set(c, occurence ? occurence + 1 : 1);
            }
            return Array.from(occurrenceMap.values());
        })
        .map(occurences => [occurences.includes(2) ? 1 : 0, occurences.includes(3) ? 1 : 0])
        .reduce((f2, f3) => [f2[0] + f3[0], f2[1] + f3[1]], [0, 0]);

    return sums[0] * sums[1];
}

export function part2(): string | null {
    const ids = common.readInput(__dirname);
    for (let i = 0; i < ids.length; i += 1) {
        for (let j = i + 1; j < ids.length; j += 1) {
            if (idsMatches(ids[i], ids[j])) {
                return extractCommonPart(ids[i], ids[j]);
            }
        }
    }
    return null;

    function idsMatches(firstId: string, secondId: string): boolean {
        if (firstId.length !== secondId.length) {
            return false;
        }
        let diffFound = false;
        for (let i = 0; i < firstId.length; i += 1) {
            if (firstId[i] === secondId[i]) {
                continue;
            } else if (!diffFound) {
                diffFound = true;
            } else {
                return false;
            }
        }
        return diffFound;
    }

    function extractCommonPart(firstId: string, secondId: string): string {
        let result = '';
        for (let i = 0; i < firstId.length; i += 1) {
            if (firstId[i] === secondId[i]) {
                result = result + firstId[i];
            }
        }
        return result;
    }
}
