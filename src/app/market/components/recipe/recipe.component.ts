import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe.model';
import { CalcService } from '../../services/calc.service';

@Component({
  selector: 'dumap-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  @Input()
  recipe: Recipe;

  constructor(private itemService: CalcService) { }

  ngOnInit(): void {
  }

  itemIdByName(name: string): number {
    return this.itemService.itemByName(name).NqId;
  }

  formatTime(seconds: number) {
    let d = 0;
    let h = 0;
    let m = 0;
    let s = seconds;

    m = Math.trunc(s / 60);
    s = s % 60;

    h = Math.trunc(m / 60);
    m = m % 60;

    return ((seconds > 60 * 60) ? h + 'h ' : '') + ((seconds > 60) ? m + 'm ' : '') + s + 's';
  }
 }
