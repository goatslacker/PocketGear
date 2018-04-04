import getMoveCombinations from './getMoveCombinations';

export default function getBestMoveset(pokemon) {
  return getMoveCombinations(pokemon)[0];
}
