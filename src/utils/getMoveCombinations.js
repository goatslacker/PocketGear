import dex from 'pokemagic/dex';

function moveDPS(pokemon, moves) {
  const stabQuick = pokemon.type1 === moves.quick.Type || pokemon.type2 === moves.quick.Type;
  const stabCharge = pokemon.type1 === moves.charge.Type || pokemon.type2 === moves.charge.Type;

  const quickDMG = (moves.quick.Power || 0) * stabQuick + 1;
  const chargeDMG = (moves.charge.Power || 0) * stabCharge + 1;

  const e100 = Math.ceil(100 / moves.quick.Energy);
  const totalQuickDMG = quickDMG * e100;
  const totalQuickTime = moves.quick.DurationMs * e100;

  const charges = Math.floor(Math.abs(100 / moves.charge.Energy));
  const totalChargeDMG = chargeDMG * charges;
  const totalChargeTime = moves.charge.DurationMs * charges;

  return (totalQuickDMG + totalChargeDMG) / ((totalQuickTime + totalChargeTime) / 1000);
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

  const moveCombos = [];

  pokemon.moves.quick.forEach(quick => {
    pokemon.moves.charge.forEach(charge => {
      moveCombos.push({
        quick: dex.findMove(quick),
        charge: dex.findMove(charge),
      });
    })
  });

  movesetCache[pokemon.name] = moveCombos.sort(comboDPS(pokemon));

  return movesetCache[pokemon.name];
}
