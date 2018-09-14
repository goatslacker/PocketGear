import getMoveCombinations from './getMoveCombinations';

function defDMG(moveset) {
  const quickPower = moveset.quick.Power || 0;
  const chargePower = moveset.charge.Power || 0;

  const quickDPS = quickPower / (moveset.quick.DurationMs + 2000);
  const chargeDPE = chargePower / Math.abs(moveset.charge.Energy);

  return quickDPS * chargeDPE;
}

export default function getBestMoveset(pokemon, isDefender) {
  const moves = getMoveCombinations(pokemon);

  if (isDefender) {
    return moves.slice().sort((a, b) => (defDMG(a) > defDMG(b) ? -1 : 1))[0];
  }

  return moves[0];
}
