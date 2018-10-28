/* @flow */

import dex from 'pokemagic/dex';
import addTMCombinations from 'pokemagic/lib/addTMCombinations';

import type { Pokemon } from '../types';

function getDPSxDPE(pokemon, m) {
  const power = m.Power || 0;
  const multiplier =
    pokemon.type1 === m.Type || pokemon.type2 === m.Type ? 1.25 : 1;
  const dmg = Math.floor(power * multiplier);

  return (dmg / m.DurationMs) * (dmg / Math.abs(m.Energy));
}

function normalizeLegacy(legacy) {
  if (legacy === 0 || legacy === 1 || legacy === 5) return 0;
  if (legacy === 3) return 2;
  return legacy;
}

export default function getSpecialAttacks(pokemon: Pokemon) {
  const chargeMoves = addTMCombinations(pokemon).map(({ A, B, legacy }) => {
    const move = dex.findMove(B);
    move.legacy = normalizeLegacy(legacy, A);
    return move;
  });
  return Array.from(new Set(chargeMoves)).sort(
    (a, b) => getDPSxDPE(pokemon, b) - getDPSxDPE(pokemon, a)
  );
}
