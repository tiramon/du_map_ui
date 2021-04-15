import { Scan } from './Scan';

export class Face {
    tileId: number;
    owner: string;
    own: boolean;
    center: number[];
    vertices: number[][];

    duEntityId: number;
    latitude: number;
    longitude: number;

    scan: Scan;
    color: {r: number, g: number, b: number};
}
