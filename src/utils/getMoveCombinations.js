import dex from 'pokemagic/dex';

export default function getMoveCombinations(pokemon) {
  const moveCombos = [];

  pokemon.moves.quick.forEach(quick => {
    pokemon.moves.charge.forEach(charge => {
      moveCombos.push({
        quick: dex.findMove(quick),
        charge: dex.findMove(charge),
      });
    })
  });

  return moveCombos;
}
