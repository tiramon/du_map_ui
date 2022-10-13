import { Recipe } from './recipe.model';

export interface inputItem {
    Name: string;
    Description: string;
    Volume: number;
    Tier: number;
    NqId: number | null;
    Mass: number;
    Icon: string;
    GroupId: string;

    recipe?: Recipe;
}
