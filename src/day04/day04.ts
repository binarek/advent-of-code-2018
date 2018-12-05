import moment = require("moment");
import common = require("../common");

const lineRegex = /\[(\d+-\d+-\d+\s+\d+:\d+)\]\s+(.+)/;
const beginShiftRegex = /Guard #(\d+) begins shift/;
const wakesUpRegex = /wakes up/;
const fallAsleepRegex = /falls asleep/;

type Guard = number;
type Minute = number;
type Event = [Date, ["g", number] | ["w"] | ["s"]];
type GuardsMinutesDream = Map<Guard, Map<Minute, number>>;

export function part1(): number {
    const guardsMinutesDream = analyzeEvents(readRecording());

    const chosenGuard = Array.from(guardsMinutesDream)
        .map(([guard, minutesMap]) => [guard, sumMinutes(minutesMap)])
        .reduce((bestGuard, guard) => guard[1] > bestGuard[1] ? guard : bestGuard)[0];

    const chosenMinute = Array.from(guardsMinutesDream.get(chosenGuard)!)
        .reduce((bestMinute, minute) => minute[1] > bestMinute[1] ? minute : bestMinute)[0];

    return chosenGuard * chosenMinute;

    function sumMinutes(minutesMap: Map<Minute, number>): number {
        return Array.from(minutesMap)
            .map(([minute, counter]) => counter)
            .reduce((c1, c2) => c1 + c2, 0);
    }
}

export function part2(): number {
    const guardsMinutesDream = analyzeEvents(readRecording());
    const [chosenGuard, chosenMinute, minuteSum] = Array.from(guardsMinutesDream)
        .map(([guard, minutesMap]) => {
            const minuteAndSum = getMinuteAndSum(minutesMap);
            return [guard, minuteAndSum[0], minuteAndSum[1]];
        })
        .reduce((bestResult, result) => result[2] > bestResult[2] ? result : bestResult);

    return chosenGuard * chosenMinute;

    function getMinuteAndSum(minutesMap: Map<Minute, number>): [Minute, number] {
        return Array.from(minutesMap)
            .reduce((bestMinute, minute) => minute[1] > bestMinute[1] ? minute : bestMinute);
    }
}

function readRecording(): Event[] {
    return common.readInput(__dirname)
        .map((line) => extarctEvent(line))
        .sort((data1, data2) => data1[0].getTime() - data2[0].getTime());

    function extarctEvent(line: string): Event {
        let match = lineRegex.exec(line);
        if (!match) {
            throw new Error("invalid input");
        }
        const date = moment(match![1], "YYYY-MM-DD HH:mm").toDate();
        const event = match![2];

        match = beginShiftRegex.exec(event);
        if (match) {
            return [date, ["g", +match[1]]];
        }
        match = wakesUpRegex.exec(event);
        if (match) {
            return [date, ["w"]];
        }
        match = fallAsleepRegex.exec(event);
        if (match) {
            return [date, ["s"]];
        }
        throw new Error("invalid input");
    }
}

function analyzeEvents(recording: Event[]): GuardsMinutesDream {
    const guardsSleepMinutes: GuardsMinutesDream = new Map();
    let currentGuard: number | undefined;
    let fallAsleep: Date | undefined;

    for (const [date, eventType] of recording) {
        if (eventType[0] === "g") {
            currentGuard = eventType[1];
        } else if (eventType[0] === "s") {
            fallAsleep = date;
        } else {    // option "w"
            if (!fallAsleep || !currentGuard) {
                throw new Error("invalid input");
            }
            const sleepDuration = moment(date).diff(moment(fallAsleep), "minutes");
            let currentMinute = fallAsleep.getMinutes();
            for (let i = sleepDuration; i > 0; i--) {

                const minuteMap = guardsSleepMinutes.get(currentGuard) || new Map();
                minuteMap.set(currentMinute, (minuteMap.get(currentMinute) || 0) + 1);
                guardsSleepMinutes.set(currentGuard, minuteMap);

                currentMinute += 1;
                if (currentMinute === 60) {
                    currentMinute = 0;
                }
            }
        }
    }
    return guardsSleepMinutes;
}
