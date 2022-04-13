
export class Scan {
    time: Date;
    ores: object = {};
    tileId: number;
    planet: string;
    owner: string;

    constructor() {}

    public static sumOre(scan: Scan): number  {
        return Object.keys(scan.ores)
            .map(key => scan.ores[key])
            .reduce((p, c) => p + c , 0);
    }

    public static sumHc(scan: Scan, ores: {name, hc}[]): number {
        return Object.keys(scan.ores)
            .map(key => scan.ores[key] * ores.filter(o => o.name === key)[0].hc)
            .reduce((p, c) => p + c , 0);
    }

    public static sumQuanta(scan: Scan, ores: {name, quanta}[]): number {
        return Object.keys(scan.ores)
            .map(key => scan.ores[key] * ores.filter(o => o.name === key)[0].quanta)
            .reduce((p, c) => p + c , 0);
    }

}
