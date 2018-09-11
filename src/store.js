/* @flow */

import typeChart from './data/type_chart.json';
import colors from './colors.json';
import sprites from './sprites';
import type { Pokemon, PokemonID, PokemonType, TypeChart } from './types';

import dex from 'pokemagic/dex';
import ucFirst from './utils/ucFirst';
import getMaxCP from 'pokemagic/lib/getMaxCP';

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

const allPokemon = dex.getAllPokemon().map(pokemon => {
  return Object.assign({}, pokemon, {
    types: [ucFirst(pokemon.type1), ucFirst(pokemon.type2 || '')].filter(
      Boolean
    ),
  });
});

const pokeFastCache = {};

function getPokemonByName(name): Pokemon {
  if (pokeFastCache[name]) {
    return pokeFastCache[name];
  }

  const pokemon = allPokemon.find(poke => poke.name.toUpperCase() === name);

  pokeFastCache[name] = pokemon;

  return pokemon;
}

function getPokemons(): Array<Pokemon> {
  return allPokemon;
}

function getTypeChart(): Array<TypeChart> {
  return typeChart;
}

function getSprite(id: PokemonID): any {
  return sprites[id];
}

function getColor(type: PokemonType): string {
  return colors[type.toLowerCase()];
}

function getCPValues() {
  return CP_VALUES;
}

function getPokemonByID(id) {
  return allPokemon.find(poke => poke.id === id);
}

export default {
  getCPValues,
  getColor,
  getMaxCP,
  getPokemonByID,
  getPokemonByName,
  getPokemons,
  getSprite,
  getTypeChart,
};
