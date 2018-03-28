/* @flow */

import dex from 'pokemagic/dex';

import type { Pokemon } from '../types';

export default function getQuickAttacks(pokemon: Pokemon) {
  return pokemon.moves.quick
    .map(dex.findMove)
    .sort((a, b) => (b.Power || 0) / b.DurationMs - (a.Power || 0) / a.DurationMs);
}
