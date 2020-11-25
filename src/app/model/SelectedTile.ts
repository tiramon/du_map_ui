export class SelectedTile {

    constructor(public tileId: number, public celestialId: number) {
    }

    public toString(): string {
        return `${this.tileId} @ ${this.celestialId}`;
    }
}
