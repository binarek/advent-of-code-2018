import common = require("../common");

const lineRegex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;

class Claim {
    constructor(public id: number,
                public x: number,
                public y: number,
                public width: number,
                public height: number) {
    }
}

export function part1(): number {
    const claims = readClaims();
    const takenInches = new Map<number, Map<number, number>>();

    for (const claim of claims) {
        const maxX = claim.x + claim.width;
        for (let x = claim.x; x < maxX; x += 1) {
            const maxY = claim.y + claim.height;
            for (let y = claim.y; y < maxY; y += 1) {
                const yMap = takenInches.get(x) || new Map<number, number>();
                yMap.set(y, (yMap.get(y) || 0) + 1);
                takenInches.set(x, yMap);
            }
        }
    }

    return Array.from(takenInches)
        .map(([x, yMap]) => Array.from(yMap))
        .map((entries) => entries
            .map(([y, counter]) => counter)
            .filter((c) => c > 1)
            .reduce((inches, c) => inches + 1, 0))
        .reduce((c1, c2) => c1 + c2);
}

export function part2(): number | undefined {
    const claims = readClaims();

    for (const claim1 of claims) {
        let covers = false;
        for (const claim2 of claims) { // TODO more optimal solution?
            if (claim1 !== claim2 &&
                coversInterval(claim1, claim2, (claim) => [claim.x, claim.x + claim.width]) &&
                coversInterval(claim1, claim2, (claim) => [claim.y, claim.y + claim.height])) {

                covers = true;
                break;
            }
        }
        if (!covers) {
            return claim1.id;
        }
    }
    return undefined;

    function coversInterval(claim1: Claim, claim2: Claim, clacInterval: (c: Claim) => [number, number]): boolean {
        const i1 = clacInterval(claim1);
        const i2 = clacInterval(claim2);

        return (i1[0] < i2[0] && i2[0] < i1[1]) ||
            (i2[0] < i1[0] && i1[0] < i2[1]) ||
            (i1[0] === i2[0]);
    }
}

function readClaims() {
    return common.readInput(__dirname)
        .map((line) => lineRegex.exec(line))
        .filter((match) => match)
        .map((match) => new Claim(+match![1], +match![2], +match![3], +match![4], +match![5]));
}
