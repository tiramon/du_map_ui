import { Injectable } from '@angular/core';
import { AvgOrePrice } from '@tiramon/du-market-api';
import { inputItem } from '../model/inputItem.model';

import itemJson from '../../../assets/market/items.json';
import schematicJson from '../../../assets/market/schematic.json';
import skillJson from '../../../assets/market/skills.json';
import { SchematicItem } from '../model/schematicItem.model';

@Injectable({
  providedIn: 'root',
})
export class CalcService {
  valueCacheWithoutSkillsAndNanocrafter: { [key: number]: number } = {};
  valueCacheWithSkillsAndNanocrafter: { [key: number]: number } = {};
  valueCacheWithoutSkills: { [key: number]: number } = {};
  valueCacheWithSkills: { [key: number]: number } = {};

  constructor() {}

  clearValueCache(orePrices: Array<AvgOrePrice>) {
    this.valueCacheWithoutSkills = {};
    orePrices.forEach(
      avg =>
        (this.valueCacheWithoutSkillsAndNanocrafter[avg.itemType] = avg.sellAvg)
    );
    orePrices.forEach(
      avg =>
        (this.valueCacheWithSkillsAndNanocrafter[avg.itemType] = avg.sellAvg)
    );
    orePrices.forEach(
      avg => (this.valueCacheWithoutSkills[avg.itemType] = avg.sellAvg)
    );
    orePrices.forEach(
      avg => (this.valueCacheWithSkills[avg.itemType] = avg.sellAvg)
    );

    // Pure Hydrogen
    this.valueCacheWithoutSkillsAndNanocrafter['1010524904'] = 0;
    this.valueCacheWithSkillsAndNanocrafter['1010524904'] = 0;
    this.valueCacheWithoutSkills['1010524904'] = 0;
    this.valueCacheWithSkills['1010524904'] = 0;
    // Pure Oxygen
    this.valueCacheWithoutSkillsAndNanocrafter['947806142'] = 0;
    this.valueCacheWithSkillsAndNanocrafter['947806142'] = 0;
    this.valueCacheWithoutSkills['947806142'] = 0;
    this.valueCacheWithSkills['947806142'] = 0;

    // Relic Plasma Unus L
    // this.valueCacheWithoutSkills['947806142'] = 0;
    // this.valueCacheWithSkills['947806142'] = 0;

    console.log(
      'reseted item values',
      JSON.stringify(this.valueCacheWithoutSkills)
    );
  }

  itemByName(name: string): inputItem {
    return (itemJson as inputItem[]).filter(
      (item: inputItem) => item.Name === name
    )[0];
  }

  itemByNqId(itemType: number): inputItem {
    return (itemJson as inputItem[]).filter(
      (item: inputItem) => item.NqId === itemType
    )[0];
  }

  getRecipesUsingItem(itemType: number): inputItem[] {
    const item = this.itemByNqId(itemType);
    return (itemJson as inputItem[])
      .filter(i => i.recipe)
      .filter(
        i =>
          Object.keys(i.recipe.ingredients).filter(p => p === item.Name)
            .length > 0
      );
  }

  calcOrePriceOneItem(
    item: inputItem,
    charSkills: {},
    skipNanocrafterSchematics: boolean
  ): number {
    if (!item) {
      console.error('got undefined item');
      return 0;
    }

    const skillValue = charSkills ? 5 : 0;

    let cache;
    if (charSkills) {
      if (skipNanocrafterSchematics) {
        cache = this.valueCacheWithSkillsAndNanocrafter;
      } else {
        cache = this.valueCacheWithSkills;
      }
    } else {
      if (skipNanocrafterSchematics) {
        cache = this.valueCacheWithoutSkillsAndNanocrafter;
      } else {
        cache = this.valueCacheWithoutSkills;
      }
    }

    if (item.recipe?.ingredients && !cache[item.NqId]) {
      let itemCost = 0;
      const skills = skillJson.filter(skill =>
        skill.ApplicableRecipes.includes(item.Name)
      );

      for (const ingredient of Object.keys(item.recipe.ingredients)) {
        const ingredientItem = this.itemByName(ingredient);
        if (!ingredientItem) {
          console.error('got undefined item for key ', ingredient);
        }
        const price = this.calcOrePriceOneItem(
          ingredientItem,
          charSkills,
          skipNanocrafterSchematics
        );

        let inputQuantity = item.recipe.ingredients[ingredient];

        const skillAddition = skills
          .filter(skill => skill.InputTalent)
          .filter(skill => skill.Addition > 0)
          .map(skill => skill.Addition * skillValue)
          .reduce((prev, current) => prev + current, 0);
        const skillMultiplier = skills
          .filter(skill => skill.InputTalent)
          .filter(skill => skill.Addition < 1)
          .map(skill => skill.Multiplier * skillValue)
          .reduce((prev, current) => prev + current, 0);
        if (skillAddition) {
          inputQuantity += skillAddition;
        } else {
          inputQuantity += inputQuantity * skillMultiplier;
        }
        // modify inputQuantity by Skill
        itemCost += price * inputQuantity;
        console.log(
          'ingredient ',
          ingredient,
          item.recipe.ingredients[ingredient],
          inputQuantity,
          (price ?? 0) * inputQuantity
        );
      }

      const product = Object.keys(item.recipe.products).filter(
        productItem => productItem === item.Name
      )[0];
      let outputQuantity = item.recipe.products[product];
      // tslint:disable-next-line:max-line-length
      const skillOutputAddition = skills
        .filter(skill => !skill.InputTalent)
        .filter(skill => skill.Addition > 0)
        .map(skill => skill.Addition * skillValue)
        .reduce((prev, current) => prev + current, 0);
      // tslint:disable-next-line:max-line-length
      const skillOutputMultiplier = skills
        .filter(skill => !skill.InputTalent)
        .filter(skill => skill.Addition < 1)
        .map(skill => skill.Multiplier * skillValue)
        .reduce((prev, current) => prev + current, 0);
      if (skillOutputAddition) {
        outputQuantity += skillOutputAddition;
      } else {
        outputQuantity += outputQuantity * skillOutputMultiplier;
      }
      // modify outputQuantity by Skill
      const pricePerItem = itemCost / outputQuantity;
      let schematicPricePerItem =
        this.getSchematicCostPerItem(item) / outputQuantity;
      if (skipNanocrafterSchematics && this.isNanocraftable(item.Name)) {
        schematicPricePerItem = 0;
      }
      cache[item.NqId] = pricePerItem + schematicPricePerItem;
    } else if (!item.recipe?.ingredients && !cache[item.NqId]) {
      console.error('no price or recipe for item', item.Name);
    }
    console.log(item.Name, cache[item.NqId]);
    return cache[item.NqId];
  }

  isNanocraftable(name: string) {
    const schematic = this.getSchematicByName(name);
    if (!schematic) {
      return true;
    }
    return !!schematic.nanocrafter;
  }

  getSchematicCostPerItem(item: inputItem): number {
    const schematic = this.getSchematicByName(item.recipe.schematic);
    if (!schematic) {
      console.log('no schematic needed for', item.Name);
      return 0;
    }
    console.log('schematic', item.Name, schematic);
    return schematic.cost / schematic.amount;
  }
  getSchematicByName(name: string): SchematicItem {
    return (schematicJson as SchematicItem[]).filter(s => s.name === name)[0];
  }

  getAffectingSkill(item): string[] {
    if (!item) {
      return null;
    }
    const skills = [];
    if (item.recipe?.ingredients) {
      item.recipe.ingredients.forEach(ingredient => {
        const ingredientItem = this.itemByName(ingredient.key);
        const ingredientSkills = this.getAffectingSkill(ingredientItem);
        if (ingredientSkills) {
          skills.push(...ingredientSkills);
        }
      });
    }
    const currentSkills = skillJson
      .filter(skill => skill.ApplicableRecipes.includes(item.Name))
      .map(skill => skill.Name);
    skills.push(...currentSkills);
    return [...new Set(skills)];
  }
}
