import store from '../store';

export default function getWeakAgainstTypes(pokemon) {
  const { types } = pokemon;
  const typeChart = store.getTypeChart();

  return typeChart
    .filter((t) => types.some((it) => t.super_effective.includes(it)))
    .map((t) => t.name);
}
