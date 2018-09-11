import React, { PureComponent } from 'react';
import attackerProfile from 'pokemagic/lib/attackerProfile';

import DamageOutputScreen from './DamageOutputScreen';
import store from '../store';

function getProfile(pokemon, state) {
  const chargeMoveName = state.chargeMove.Name;
  const quickMoveName = state.quickMove.Name;

  const { data } = attackerProfile({
    chargeMoveName,
    numPokemon: 20,
    pokemon,
    quickMoveName,
    scoring: state.sort,
    weather: state.weather,
  });

  const [moveset] = data;

  return {
    key: `${moveset.quick}/${moveset.charge}`,
    quick: moveset.quick,
    charge: moveset.charge,
    results: moveset.results.map(x => {
      const pokemon = store.getPokemonByID(x.id);
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

function goToBattle(pokemon, navigation) {
  return (defender, state, rowData) => {
    navigation.navigate('Arena', {
      atkId: pokemon.id,
      atkQuick: state.quickMove.Name,
      atkCharge: state.chargeMove.Name,
      defId: defender.id,
      defQuick: rowData[1],
      defCharge: rowData[2],
      weather: state.weather,
    });
  };
}

function getResults(pokemon) {
  return state => {
    const { results } = getProfile(pokemon, state);
    return results;
  };
}

export default class PokemonBattle extends PureComponent {
  render() {
    const { navigation, pokemon } = this.props;

    return (
      <DamageOutputScreen
        cacheKey="battle"
        getResults={getResults(pokemon)}
        handlePokemonPress={goToBattle(pokemon, navigation)}
        navigation={navigation}
        pokemon={pokemon}
      />
    );
  }
}
