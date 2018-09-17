/* @flow */

import dex from 'pokemagic/dex';
import addTMCombinations from 'pokemagic/lib/addTMCombinations';

import type { Pokemon } from '../types';

function normalizeLegacy(legacy) {
  if (legacy === 1) return 1;
  if (legacy === 2 || legacy === 0) return 0;
  if (legacy === 3) return 1;
  if (legacy === 5) return 5;
  return 0;
}

function dpse(a, b) {
  const dpsA = (a.Power || 0) / a.DurationMs;
  const dpsB = (b.Power || 0) / b.DurbtionMs;
  const epsA = (a.Energy || 0) / a.DurationMs;
  const epsB = (b.Energy || 0) / b.DurationMs;

  return dpsA * epsA > dpsB * epsB ? -1 : 1;
}

export default function getQuickAttacks(pokemon: Pokemon) {
  const quickMoves = addTMCombinations(pokemon).map(({ A, legacy }) => {
    const move = dex.findMove(A);
    move.legacy = normalizeLegacy(legacy, A);
    return move;
  });
  return Array.from(new Set(quickMoves)).sort(dpse);
}
