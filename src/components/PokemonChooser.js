/* @flow */

import filter from 'lodash/filter';
import debounce from 'lodash/debounce';
import React, { PureComponent } from 'react';
import dex from 'pokemagic/dex';
import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import PokemonList from './PokemonList';
import isLegendary from 'pokemagic/lib/isLegendary';
import NoResults from './NoResults';
import ProgressLabel from './ProgressLabel';
import store from '../store';
import type { Pokemon } from '../types';
import parseSearchString from '../utils/parseSearchString';
import addTMCombinations from 'pokemagic/lib/addTMCombinations';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -20,
  },

  content: {
    backgroundColor: '#fafafa',
    paddingTop: 154,
  },

  searchbar: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
  },

  wide: {
    marginTop: 8,
    width: 170,
  },
});

type SortKey = '#' | 'name' | 'attack' | 'defense' | 'max_cp' | 'stamina';

type State = {
  query: string,
  sort: SortKey,
  results: {
    pokemons: Array<Pokemon>,
  },
};

type Props = {
  onChosen?: func,
  navigation: Object,
};

function getCardProps(pokemon) {
  return {
    atk: pokemon.stats.attack,
    def: pokemon.stats.defense,
    sta: pokemon.stats.stamina,
  };
}

export default class PokemonChooser extends PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      query: '',
      sort: 'max_cp',
      results: {
        pokemons: store.getPokemons(),
      },
    };
  }

  _getResults = (text: string) => {
    const query = text.toLowerCase().trim();
    const pokemons = store.getPokemons();

    if (!query) {
      return pokemons;
    }

    const search = parseSearchString(query);

    return pokemons.filter(pokemon => {
      return search(({ cp, hp, species, move, poke, special, text }) => {
        if (text) {
          if (text === 'lucky') {
            return Math.random() < 0.02;
          }

          if (!isNaN(text)) {
            return pokemon.dex === parseInt(text, 10);
          }
          return (
            pokemon.name.toLowerCase().indexOf(text) === 0 ||
            pokemon.types.some(type => type.toLowerCase().indexOf(text) === 0)
          );
        }

        if (move) {
          const moves = addTMCombinations(pokemon);
          const moveInfo = dex.findMove(move);
          return moves.some(
            move => move.A === moveInfo.Name || move.B === moveInfo.Name
          );
        }

        // TODO
        if (cp) {
          return false;
        }

        // TODO
        if (hp) {
          return false;
        }

        if (species) {
          return pokemon.family === `FAMILY_${species.toUpperCase()}`;
        }

        // pokemon range
        if (poke) {
          const start = !isNaN(poke[0]) ? Number(poke[0]) : -Infinity;
          const end = !isNaN(poke[1]) ? Number(poke[1]) : Infinity;

          return pokemon.dex >= start && pokemon.dex <= end;
        }

        if (special === 'mythical') {
          return pokemon.id === 'V0251' || pokemon.id === 'V0151';
        }

        if (special === 'alola') {
          return pokemon.form === `${pokemon.name}_ALOLA`;
        }

        if (special === 'evolve') {
          return !!pokemon.evolutionBranch;
        }

        if (special === 'legacy') {
          return addTMCombinations(pokemon).some(x => x.legacy > 0);
        }

        if (special === 'legendary') {
          return isLegendary(pokemon.name);
        }

        return false;
      });
    });
  };

  _sortResults = (results: Array<Pokemon>) => {
    const { sort } = this.state;
    return results.slice(0).sort((a, b) => {
      switch (sort) {
        case 'max_cp':
          return store.getMaxCP(b) - store.getMaxCP(a);
        case '#':
          return a.dex - b.dex;
        case 'attack':
          return b.stats.attack - a.stats.attack;
        case 'defense':
          return b.stats.defense - a.stats.defense;
        case 'stamina':
          return b.stats.stamina - a.stats.stamina;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  _updateResults = debounce(() => {
    const pokemons = this._getResults(this.state.query);
    this.setState(
      {
        results: { pokemons },
      },
      () => {
        if (this._list) {
          this._list.scrollTo({
            x: 0,
            y: 0,
            animated: false,
          });
        }
      }
    );
  }, 200);

  _handleSearchChange = (query: string) => {
    if (this.state.query === query) {
      return;
    }
    this.setState({
      query,
    });
    this._updateResults();
  };

  _handleChangeToggle = ({ name }: { name: SortKey }) =>
    this.setState({ sort: name });

  _list: ?Object;

  _setRef = (c: Object) => (this._list = c);

  _unsetRef = () => (this._list = null);

  handleRowPress(pokemon) {
    if (this.props.onChosen) {
      this.props.onChosen(pokemon);
      return;
    }

    this.props.navigation.navigate('Info', {
      pokemonId: pokemon.id,
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        {this.state.results.pokemons.length ? (
          <PokemonList
            scrollsToTop
            getCardProps={getCardProps}
            keyboardShouldPersistTaps="handled"
            data={this._sortResults(this.state.results.pokemons)}
            navigation={this.props.navigation}
            contentContainerStyle={styles.content}
            ref={this._setRef}
            onPress={this.handleRowPress.bind(this)}
          >
            {({ atk, def, sta }) => (
              <View style={[styles.wide]}>
                <ProgressLabel
                  color="#ff8a65"
                  label="Atk"
                  ratio={atk / 300}
                  value={atk}
                />
                <ProgressLabel
                  color="#9575cd"
                  label="Def"
                  ratio={def / 300}
                  value={def}
                />
                <ProgressLabel
                  color="#5499c7"
                  label="Sta"
                  ratio={sta / 300}
                  value={sta}
                />
              </View>
            )}
          </PokemonList>
        ) : (
          <NoResults
            label="No Pokémon found"
            source={require('../../assets/images/open-pokeball.png')}
            style={styles.content}
            ref={this._unsetRef}
          />
        )}
        <SearchBar
          placeholder="Find Pokémon by name, number or type"
          value={this.state.query}
          onChangeText={this._handleSearchChange}
          toggles={[
            {
              name: 'max_cp',
              label: 'Max CP',
              active: this.state.sort === 'max_cp',
            },
            { name: '#', label: '#', active: this.state.sort === '#' },
            { name: 'name', label: 'Name', active: this.state.sort === 'name' },
            {
              name: 'attack',
              label: 'Atk',
              active: this.state.sort === 'attack',
            },
            {
              name: 'defense',
              label: 'Def',
              active: this.state.sort === 'defense',
            },
            {
              name: 'stamina',
              label: 'Sta',
              active: this.state.sort === 'stamina',
            },
          ]}
          onChangeToggle={this._handleChangeToggle}
          style={styles.searchbar}
        />
      </KeyboardAvoidingView>
    );
  }
}
