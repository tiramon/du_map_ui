import { Injectable } from '@angular/core';
import { AvgOrePrice } from '@tiramon/du-market-api';
import { inputItem } from '../model/inputItem.model';

import itemJson from '../../../assets/market/items.json';
import schematicJson from '../../../assets/market/schematic.json';
import skillJson from '../../../assets/market/skills.json';
import { SchematicItem } from '../model/schematicItem.model';

@Injectable({
  providedIn: 'root'
})
export class CalcService {
  valueCacheWithoutSkills: {[key: number]: number} = {};
  valueCacheWithSkills: {[key: number]: number} = {};

  constructor() {
  }

  clearValueCache(orePrices: Array<AvgOrePrice>) {
    this.valueCacheWithoutSkills = {};
    orePrices.forEach(avg => this.valueCacheWithoutSkills[avg.itemType] = avg.sellAvg);
    orePrices.forEach(avg => this.valueCacheWithSkills[avg.itemType] = avg.sellAvg);
    //Pure Hydrogen
    this.valueCacheWithoutSkills['1010524904'] = 0;
    this.valueCacheWithSkills['1010524904'] = 0;
    //Pure Oxygen
    this.valueCacheWithoutSkills['947806142'] = 0;
    this.valueCacheWithSkills['947806142'] = 0;

    //Relic Plasma Unus L
    //this.valueCacheWithoutSkills['947806142'] = 0;
    //this.valueCacheWithSkills['947806142'] = 0;

    console.log('reseted item values', JSON.stringify(this.valueCacheWithoutSkills));
  }

  itemByName(name: string): inputItem {
    return (itemJson as inputItem[]).filter((item: inputItem) => item.Name === name)[0];
  }

  itemByNqId(itemType: number): inputItem {
    return (itemJson as inputItem[]).filter((item: inputItem) => item.NqId === itemType)[0];
  }

  getRecipesUsingItem(itemType: number): inputItem[] {
    const item = this.itemByNqId(itemType);
    return (itemJson as inputItem[]).filter(i => i.recipe).filter(i => i.recipe.ingredients.filter(p => p.key === item.Name).length > 0);
  }


  calcOrePriceOneItem(item: inputItem, charSkills: {} ): number {
    if (!item) {
      console.error('got undefined item');
      return 0;
    }
    if (item.recipe?.ingredients && !this.valueCacheWithoutSkills[item.NqId]) {
      let itemCost = 0;
      const skills = skillJson.filter(skill => skill.ApplicableRecipes.includes(item.Name));
      const skillValue = (charSkills ? 5 : 0);
      for (const ingredient of item.recipe.ingredients) {
        const ingredientItem = this.itemByName(ingredient.key);
        const price = this.calcOrePriceOneItem(ingredientItem, charSkills);
        let inputQuantity = ingredient.quantity;

        const skillAddition = skills.filter(skill => skill.InputTalent).filter(skill => skill.Addition > 0).map( skill => skill.Addition * skillValue).reduce((prev, current) => prev + current, 0);
        const skillMultiplier = skills.filter(skill => skill.InputTalent).filter(skill => skill.Addition < 1).map( skill => skill.Multiplier * skillValue).reduce((prev, current) => prev + current, 0);
        if (skillAddition) {
          inputQuantity += skillAddition;
        } else {
          inputQuantity += inputQuantity * skillMultiplier;
        }
        // modify inputQuantity by Skill
        itemCost += price * inputQuantity;
        console.log('ingredient ', ingredient.key, ingredient.quantity, inputQuantity, (price ?? 0) * inputQuantity);
      }

      const product = item.recipe.products.filter(productItem => productItem.key === item.Name)[0];
      let outputQuantity = product.quantity;
      const skillOutputAddition = skills.filter(skill => !skill.InputTalent).filter(skill => skill.Addition > 0).map( skill => skill.Addition * skillValue).reduce((prev, current) => prev + current, 0);
      const skillOutputMultiplier = skills.filter(skill => !skill.InputTalent).filter(skill => skill.Addition < 1).map( skill => skill.Multiplier * skillValue).reduce((prev, current) => prev + current, 0);
      if (skillOutputAddition) {
        outputQuantity += skillOutputAddition;
      } else {
        outputQuantity += outputQuantity * skillOutputMultiplier;
      }
      // modify outputQuantity by Skill
      const pricePerItem = itemCost / outputQuantity;
      const schematicPricePerItem = this.getSchematicCostPerItem(item.Name) / outputQuantity;
      this.valueCacheWithoutSkills[item.NqId] = pricePerItem + schematicPricePerItem;

    }
    console.log(item.Name, this.valueCacheWithoutSkills[item.NqId]);
    return this.valueCacheWithoutSkills[item.NqId];
  }

  getSchematicCostPerItem(name: string): number {
    const schematic = this.getSchematicByName(name);
    console.log(name, schematic);
    if (!schematic) {
      return 0;
    }
    return schematic.cost / schematic.amount;
  }
  getSchematicByName(name: string): SchematicItem {
    return (schematicJson as SchematicItem[]).filter(s => s.name === name)[0];
  }

  getAffectingSkill(item): string[] {
    const skills = [];
    if (item.recipe?.ingredients) {
      item.recipe.ingredients.forEach(ingredient => {
        const ingredientItem = this.itemByName(ingredient.key);
        const ingredientSkills = this.getAffectingSkill(ingredientItem);
        skills.push(...ingredientSkills);
      });
    }
    const currentSkills = skillJson.filter(skill => skill.ApplicableRecipes.includes(item.Name)).map(skill => skill.Name);
    skills.push(...currentSkills);
    return skills;
  }
}
