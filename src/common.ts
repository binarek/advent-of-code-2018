import fs = require('fs');
import path = require('path');

export function readInput(dir: string): string[] {
    return fs.readFileSync(path.join(dir, 'input'), 'utf-8').split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}
