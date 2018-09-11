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

    if (query) {
      if (!isNaN(query)) {
        return filter(pokemons, p => p.dex === parseInt(query, 10));
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
            keyboardShouldPersistTaps="handled"
            data={this._sortResults(this.state.results.pokemons)}
            navigation={this.props.navigation}
            contentContainerStyle={styles.content}
            ref={this._setRef}
            onPress={this.handleRowPress.bind(this)}
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
