import intersection from 'lodash/intersection';
import store from '../store';
import getAttackTypesForPokemon from './getAttackTypesForPokemon';

export default function getStrongAgainstTypes(pokemon) {
  const types = intersection(pokemon.types, getAttackTypesForPokemon(pokemon));
  const typeChart = store.getTypeChart();

  return typeChart
    .filter((t) => types.includes(t.name))
    .map((t) => t.super_effective)
    .reduce((acc, curr) => {
      const next = acc.slice();
      curr.forEach((t) => {
        if (!acc.includes(t)) {
          next.push(t);
        }
      });
      return next;
    }, []);
}
