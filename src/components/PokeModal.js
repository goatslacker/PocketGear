import React, { PureComponent } from 'react';
import PokemonChooser from './PokemonChooser';

export default class PokeModal extends PureComponent {
  theChosen(one) {
    const { navigation } = this.props;
    const { params } = navigation.state;

    if (params.onSelectPokemon) {
      params.onSelectPokemon(one);
    }
    navigation.goBack();
  }

  render() {
    const { navigation } = this.props;
    return (
      <PokemonChooser
        navigation={navigation}
        onChosen={one => this.theChosen(one)}
      />
    );
  }
}
