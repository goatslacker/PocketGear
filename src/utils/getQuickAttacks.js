/* @flow */

import dex from 'pokemagic/dex';
import addTMCombinations from 'pokemagic/lib/addTMCombinations';

import type { Pokemon } from '../types';

function normalizeLegacy(legacy, move) {
  if (legacy === 1) return 1
  if (legacy === 2 || legacy === 0) return 0
  if (legacy === 3) return 1
  if (legacy === 4 && move === 'SMACK_DOWN_FAST') return 4
  return 0
}

export default function getQuickAttacks(pokemon: Pokemon) {
  const quickMoves = addTMCombinations(pokemon).map(({ A, legacy }) => {
    const move = dex.findMove(A)
    move.legacy = normalizeLegacy(legacy, A)
    return move
  })
  return Array.from(new Set(quickMoves)).sort(
    (a, b) => (b.Energy || 0) / b.DurationMs - (a.Energy || 0) / a.DurationMs
  );
}
