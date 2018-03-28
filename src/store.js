/* @flow */

import pokemons from './data/pokemons.json';
import typeChart from './data/type_chart.json';
import colors from './colors.json';
import sprites from './sprites';
import type { Pokemon, PokemonID, PokemonType, Move, TypeChart } from './types';

const MAX_VALUES = {
  attack: 300,
  defense: 200,
  stamina: 320,
  max_hp: 163,
  max_cp: 3904,
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

function getMaxValues() {
  return MAX_VALUES;
}

export default {
  getPokemonByName,
  getPokemons,
  getTypeChart,
  getSprite,
  getColor,
  getMaxValues,
};
