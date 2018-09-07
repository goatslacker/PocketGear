import dex from 'pokemagic/dex';
import addTMCombinations from 'pokemagic/lib/addTMCombinations';

function moveDPS(pokemon, moveset) {
  const stabQuick =
    pokemon.type1 === moveset.quick.Type || pokemon.type2 === moveset.quick.Type;
  const stabCharge =
    pokemon.type1 === moveset.charge.Type || pokemon.type2 === moveset.charge.Type;

  const quickDMG = (moveset.quick.Power || 0) * stabQuick + 1;
  const chargeDMG = (moveset.charge.Power || 0) * stabCharge + 1;

  const e100 = Math.ceil(100 / moveset.quick.Energy);
  const totalQuickDMG = quickDMG * e100;
  const totalQuickTime = moveset.quick.DurationMs * e100;

  const charges = Math.floor(Math.abs(100 / moveset.charge.Energy));
  const totalChargeDMG = chargeDMG * charges;
  const totalChargeTime = moveset.charge.DurationMs * charges;

  return (
    (totalQuickDMG + totalChargeDMG) /
    ((totalQuickTime + totalChargeTime) / 1000)
  );
}

function comboDPS(pokemon) {
  return (a, b) => {
    const dpsA = moveDPS(pokemon, a);
    const dpsB = moveDPS(pokemon, b);

    return dpsA > dpsB ? -1 : 1;
  };
}

const movesetCache = {};

export default function getMoveCombinations(pokemon) {
  if (movesetCache[pokemon.name]) {
    return movesetCache[pokemon.name];
  }

  const moveCombos = addTMCombinations(pokemon).map(({ A, B, legacy }) => {
    return {
      quick: dex.findMove(A),
      charge: dex.findMove(B),
      legacy,
    };
  });

  movesetCache[pokemon.name] = moveCombos.sort(comboDPS(pokemon));

  return movesetCache[pokemon.name];
}
