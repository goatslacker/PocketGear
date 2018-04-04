/* @flow */

import dex from 'pokemagic/dex';

import type { Pokemon } from '../types';

export default function getQuickAttacks(pokemon: Pokemon) {
  return pokemon.moves.quick
    .map(dex.findMove)
    .sort(
      (a, b) => (b.Energy || 0) / b.DurationMs - (a.Energy || 0) / a.DurationMs
    );
}
