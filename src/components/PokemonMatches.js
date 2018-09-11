/* @flow */

import React from 'react';
import defenderProfile from 'pokemagic/defenderProfile';

import DamageOutputScreen from './DamageOutputScreen';
import store from '../store';

function getDefenderProfile(pokemon, { quickMove, chargeMove, weather, sort }) {
  const quickMoveName = quickMove.Name;
  const chargeMoveName = chargeMove.Name;
  const { data } = defenderProfile({
    chargeMoveName,
    filterAttackerMoveset: move => move.legacy === 0,
    numPokemon: 20,
    pokemon,
    quickMoveName,
    weather,
    scoring: sort,
  });

  const [moveset] = data;

  return {
    key: `${moveset.quick}/${moveset.charge}`,
    quick: moveset.quick,
    charge: moveset.charge,
    results: moveset.results.map(x => {
      const pokemon = store.getPokemonByName(x.name);
      const [quick, charge] = x.stats[0].moves;

      return [
        pokemon.id,
        quick,
        charge,
        x.stats[0].dps,
        x.stats[0].tdo,
        x.stats[0].total,
      ];
    }),
  };
}

function goToBattle(defender, navigation) {
  return (attacker, state, rowData) => {
    navigation.navigate('Arena', {
      atkId: attacker.id,
      atkQuick: rowData[1],
      atkCharge: rowData[2],
      defId: defender.id,
      defQuick: state.quickMove.Name,
      defCharge: state.chargeMove.Name,
      weather: state.weather,
    });
  };
}

function getResults(pokemon) {
  return state => {
    const { results } = getDefenderProfile(pokemon, state);
    return results;
  };
}

export default class PokemonMatches extends React.Component {
  render() {
    const { navigation, pokemon } = this.props;

    return (
      <DamageOutputScreen
        cacheKey="matches"
        getResults={getResults(pokemon)}
        handlePokemonPress={goToBattle(pokemon, navigation)}
        navigation={navigation}
        pokemon={pokemon}
      />
    );
  }
}
