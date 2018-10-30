import dex from 'pokemagic/dex';
import getHP from 'pokemagic/lib/getHP';
import getMaxCP from 'pokemagic/lib/getMaxCP';

import colors from './colors.json';
import sprites from './sprites';
import typeChart from './data/type_chart.json';
import ucFirst from './utils/ucFirst';

const CP_VALUES = {
  max_cp: 4548,

  // These are intentionally not set at the maximum value but rather at an
  // arbitrary level that is deemed "good enough" for that stat. This is
  // for presentational purposes only.
  attack: 300, // 300 (Mewtwo)
  defense: 300, // 396 (Shuckle)
  stamina: 300, // 510 (Blissey)
  max_hp: 250, // 414
};

const allPokemon = dex.getAllPokemon().map((pokemon) => {
  return Object.assign({}, pokemon, {
    types: [ucFirst(pokemon.type1), ucFirst(pokemon.type2 || '')].filter(
      Boolean
    ),
  });
});

function getPokemons() {
  return allPokemon;
}

function getTypeChart() {
  return typeChart;
}

function getSprite(id) {
  return sprites[id];
}

function getColor(type) {
  return colors[type.toLowerCase()];
}

function getCPValues() {
  return CP_VALUES;
}

const pokeFastCache = {};

function getPokemonByID(id) {
  if (pokeFastCache[id]) {
    return pokeFastCache[id];
  }

  const pokemon = allPokemon.find((poke) => poke.id === id);
  pokeFastCache[id] = pokemon;
  return pokemon;
}

function getMaxHP(pokemon) {
  return getHP(pokemon, 15, 0.79030001);
}

export default {
  getCPValues,
  getColor,
  getMaxCP,
  getMaxHP,
  getPokemonByID,
  getPokemons,
  getSprite,
  getTypeChart,
};
