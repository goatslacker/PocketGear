/* @flow */

import dex from 'pokemagic/dex';

import type { Pokemon } from '../types';

function getDPSxDPE(pokemon, m) {
  const power = m.Power || 0;
  const multiplier =
    pokemon.type1 === m.Type || pokemon.type2 === m.Type ? 1.25 : 1;
  const dmg = Math.floor(power * (multiplier - 1));

  return dmg / m.DurationMs * dmg / Math.abs(m.Energy);
}

export default function getSpecialAttacks(pokemon: Pokemon) {
  return pokemon.moves.charge
    .map(dex.findMove)
    .sort((a, b) => getDPSxDPE(pokemon, b) - getDPSxDPE(pokemon, a));
}
