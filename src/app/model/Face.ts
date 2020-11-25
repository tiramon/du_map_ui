import { Scan } from './Scan';

export class Face {
    tileId: number;
    owner: string;
    center: number[];
    vertices: number[][];

    duEntityId: number;
    latitude: number;
    longitude: number;

    scan: Scan;
}
