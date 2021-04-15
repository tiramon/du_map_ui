export class Scan {
    time: Date;
    ores: object = {};
    tileId: number;
    planet: string;

    constructor() {}

    public static sumOre(scan: Scan): number  {
        return Object.keys(scan.ores).map(key => scan.ores[key]).reduce((p, c) => p + c );
    }
}
