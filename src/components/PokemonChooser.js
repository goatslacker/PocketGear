/* @flow */

import filter from 'lodash/filter';
import debounce from 'lodash/debounce';
import React, { PureComponent } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import PokemonList from './PokemonList';
import NoResults from './NoResults';
import store from '../store';
import type { Pokemon } from '../types';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    backgroundColor: '#fafafa',
    paddingTop: SearchBar.HEIGHT + 4,
  },

  searchbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

type SortKey = '#' | 'name' | 'attack' | 'defense' | 'max_cp';

type State = {
  query: string,
  sort: SortKey,
  results: {
    pokemons: Array<Pokemon>,
  },
};

type Props = {
  navigation: Object,
};

export default class PokemonChooser extends PureComponent<Props, State> {
  state: State = {
    query: '',
    sort: 'max_cp',
    results: {
      pokemons: store.getPokemons(),
    },
  };

  _getResults = (text: string) => {
    const query = text.toLowerCase().trim();
    const pokemons = store.getPokemons();

    if (query) {
      if (!isNaN(query)) {
        return filter(pokemons, p => p.id === parseInt(query, 10));
      }
      return filter(pokemons, pokemon => {
        return (
          /* String#startsWith doesn't work properly for unicode */
          pokemon.name.toLowerCase().indexOf(query) === 0 ||
          query
            .split(',')
            .map(q => q.trim())
            .every(q =>
              pokemon.types.some(type => type.toLowerCase().indexOf(q) === 0)
            )
        );
      });
    }

    return pokemons;
  };

  _sortResults = (results: Array<Pokemon>) => {
    const { sort } = this.state;
    return results.slice(0).sort((a, b) => {
      switch (sort) {
        case '#':
          return a.id - b.id;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attack':
          return b.stats.attack - a.stats.attack;
        case 'defense':
          return b.stats.defense - a.stats.defense;
        case 'max_cp':
          return store.getMaxCP(b) - store.getMaxCP(a);
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

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        {this.state.results.pokemons.length ? (
          <PokemonList
            scrollsToTop
            keyboardShouldPersistTaps="handled"
            data={this._sortResults(this.state.results.pokemons)}
            navigation={this.props.navigation}
            contentContainerStyle={styles.content}
            ref={this._setRef}
          />
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
            { name: '#', label: '#', active: this.state.sort === '#' },
            { name: 'name', label: 'Name', active: this.state.sort === 'name' },
            {
              name: 'attack',
              label: 'Attack',
              active: this.state.sort === 'attack',
            },
            {
              name: 'defense',
              label: 'Defense',
              active: this.state.sort === 'defense',
            },
            {
              name: 'max_cp',
              label: 'Max CP',
              active: this.state.sort === 'max_cp',
            },
          ]}
          onChangeToggle={this._handleChangeToggle}
          style={styles.searchbar}
        />
      </KeyboardAvoidingView>
    );
  }
}
