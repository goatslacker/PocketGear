/* @flow */

import pokemons from './data/pokemons.json';
import typeChart from './data/type_chart.json';
import colors from './colors.json';
import sprites from './sprites';
import type { Pokemon, PokemonID, PokemonType, Move, TypeChart } from './types';

const CP_VALUES = {
  max_hp: 414,
  max_cp: 4548,

  // These are intentionally not set at the maximum value but rather at an
  // arbitrary level that is deemed "good enough" for that stat. This is
  // for presentational purposes only.
  attack: 300, // 300 (Mewtwo)
  defense: 300, // 396 (Shuckle)
  stamina: 250, // 510 (Blissey)
};

const pokeFastCache = {};

function getPokemonByName(name): Pokemon {
  if (pokeFastCache[name]) {
    return pokeFastCache[name];
  }

  const pokemon = pokemons.find(poke => (
    poke.name.toUpperCase() === name
  ));

  pokeFastCache[name] = pokemon;

  return pokemon;
}

function getPokemons(): Array<Pokemon> {
  return pokemons;
}

function getTypeChart(): Array<TypeChart> {
  return typeChart;
}

function getSprite(id: PokemonID): any {
  return sprites[id - 1];
}

function getColor(type: PokemonType): string {
  return colors[type.toLowerCase()];
}

function getCPValues() {
  return CP_VALUES;
}

export default {
  getPokemonByName,
  getPokemons,
  getTypeChart,
  getSprite,
  getColor,
  getCPValues,
};
