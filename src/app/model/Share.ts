export class Share {
    planet: string;
    tileId: number;
    sharedTo: string;

    constructor(planet: string, tileId: number, sharedTo: string) {
        this.planet = planet;
        this.tileId = tileId;
        this.sharedTo = sharedTo;
    }
}
