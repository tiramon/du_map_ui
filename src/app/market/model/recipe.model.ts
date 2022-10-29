import { Ingredient } from './ingredient.model';

export interface Recipe {
    NqSchemaId: number;
    craftingTime: number;
    ingredients: Ingredient[];
    products: Ingredient[];
    schematic?: string;
}
