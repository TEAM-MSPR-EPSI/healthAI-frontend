// Component: RecipesGrid | Purpose: Displays recipe cards loaded from the API in a responsive grid.
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-recipes-grid',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatChipsModule],
  templateUrl: './recipes-grid.component.html',
  styleUrl: './recipes-grid.component.css',
})
export class RecipesGridComponent {
  @Input() recipes: any[] = [];
  @Input() loading = true;

  getRecipeEmoji(recipe: any): string {
    const haystack = [recipe?.recipe_name, recipe?.recipe_type, recipe?.recipe_description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const emojiRules: Array<{ patterns: RegExp[]; emoji: string }> = [
      { patterns: [/\bfruit(s)?\b/, /\bberry|berries\b/, /\bapple|pear|banana|orange|kiwi|mango|melon|peach|plum\b/], emoji: '🍓' },
      { patterns: [/\bvegetable(s)?\b/, /\blegume(s)?\b/, /\bsalad\b/, /\bgreen|broccoli|spinach|carrot|tomato|courgette|zucchini\b/], emoji: '🥦' },
      { patterns: [/\bmeat\b/, /\bbeef|pork|lamb|veal|steak\b/, /\bchicken|turkey|duck\b/], emoji: '🥩' },
      { patterns: [/\bfish\b/, /\bsalmon|tuna|cod|sardine|trout\b/, /\bseafood|shrimp|prawn|mussel|clam\b/], emoji: '🐟' },
      { patterns: [/\bgrain(s)?\b/, /\bcereal(s)?\b/, /\brice|wheat|oat|barley|quinoa|bread|pasta\b/], emoji: '🌾' },
      { patterns: [/\bdairy\b/, /\bmilk|cheese|yogurt|yaourt|cream|butter\b/], emoji: '🥛' },
      { patterns: [/\bnut(s)?\b/, /\bseed(s)?\b/, /\balmond|hazelnut|walnut|cashew|pistachio|sesame|chia|flax\b/], emoji: '🌰' },
      { patterns: [/\bspice(s)?\b/, /\bherb(s)?\b/, /\bginger|cinnamon|pepper|paprika|curry|thyme|basil|mint\b/], emoji: '🧂' },
      { patterns: [/\bsoup(s)?\b/, /\bvelout[eé]e?\b/, /\bbroth|bouillon\b/], emoji: '🥣' },
      { patterns: [/\bpizza\b/, /\btart(e)?|quiche\b/], emoji: '🍕' },
      { patterns: [/\bpasta\b/, /\bnoodle(s)?\b/, /\bsauce\b/], emoji: '🍝' },
      { patterns: [/\bdessert(s)?\b/, /\bcake|g[aâ]teau|tart|cookie|biscuit|muffin|brownie\b/, /\bsweet|sugar|chocolate|candy\b/], emoji: '🍰' },
      { patterns: [/\bdrink(s)?\b/, /\bbeverage(s)?\b/, /\bjuice|smoothie|tea|coffee|milkshake\b/], emoji: '🥤' },
      { patterns: [/\bbreakfast\b/, /\bbrunch\b/, /\boatmeal|porridge|pancake|waffle|omelet|omelette\b/], emoji: '🥞' },
      { patterns: [/\bsnack(s)?\b/, /\bappetizer|starter|aperitif|ap[eé]ritif\b/], emoji: '🍿' },
    ];

    for (const rule of emojiRules) {
      if (rule.patterns.some((pattern) => pattern.test(haystack))) {
        return rule.emoji;
      }
    }

    return '🍽️';
  }
}
