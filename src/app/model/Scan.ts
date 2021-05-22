import { MinedOre } from './MinedOre';

export class Scan {
    time: Date;
    ores: object = {};
    tileId: number;
    planet: string;
    owner: string;
    minedOre: MinedOre[];

    constructor() {}

    public static sumOre(scan: Scan, subtractMined: boolean): number  {
        return Object.keys(scan.ores)
            .map(key => (scan.ores[key] - (subtractMined ? Scan.sumOreMined(scan, key) : 0)))
            .reduce((p, c) => p + c , 0);
    }

    public static sumHc(scan: Scan, ores: {name, hc}[], subtractMined: boolean): number {
        return Object.keys(scan.ores)
            .map(key => (scan.ores[key] - (subtractMined ? Scan.sumOreMined(scan, key) : 0)) * ores.filter(o => o.name === key)[0].hc)
            .reduce((p, c) => p + c , 0);
    }

    public static sumQuanta(scan: Scan, ores: {name, quanta}[], subtractMined: boolean): number {
        return Object.keys(scan.ores)
            .map(key => (scan.ores[key] - (subtractMined ? Scan.sumOreMined(scan, key) : 0)) * ores.filter(o => o.name === key)[0].quanta)
            .reduce((p, c) => p + c , 0);
    }

    public static sumOreMined(scan: Scan, name: string): number {
        if (!scan.minedOre) {
            return 0;
        }
        return scan.minedOre.map(mo => mo.ores[name]).reduce((pv, cv) => pv + (cv ? +cv : 0), 0);
    }
}
