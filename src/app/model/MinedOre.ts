export class MinedOre {
    time: Date;
    ores: object = {};
    tileId: number;
    planet: string;
    owner: string;

    constructor() {}

    public static sumOre(scan: MinedOre): number  {
        return Object.keys(scan.ores).map(key => scan.ores[key]).reduce((p, c) => p + c , 0);
    }

    public static sumHc(scan: MinedOre, ores: {name, hc}[]): number {
        return Object.keys(scan.ores).map(key => scan.ores[key] * ores.filter(o => o.name === key)[0].hc).reduce((p, c) => p + c , 0);
    }

    public static sumQuanta(scan: MinedOre, ores: {name, quanta}[]): number {
        return Object.keys(scan.ores).map(key => scan.ores[key] * ores.filter(o => o.name === key)[0].quanta).reduce((p, c) => p + c , 0);
    }
}
