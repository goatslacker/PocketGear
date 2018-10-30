import store from '../store';

export default function getResistantToTypes(pokemon) {
  const { types } = pokemon;
  const typeChart = store.getTypeChart();

  return typeChart
    .filter((t) => types.some((it) => t.not_very_effective.includes(it)))
    .map((t) => t.name);
}
