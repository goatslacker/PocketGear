import React, { PureComponent } from 'react';
import { Image, View, ScrollView, StyleSheet } from 'react-native';

import Attack from './Attack';
import Heading from './Heading';
import TouchableItem from './TouchableItem';
import getQuickAttacks from '../utils/getQuickAttacks';
import getSpecialAttacks from '../utils/getSpecialAttacks';
import store from '../store';

const styles = StyleSheet.create({
  modal: {
    marginTop: 60,
  },

  padding: {
    paddingHorizontal: 40,
  },

  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  image: {
    marginHorizontal: 8,
    height: 72,
    resizeMode: 'contain',
  },
});

export default class PokeModal extends PureComponent {
  selectMove(move) {
    const { navigation } = this.props;
    const { params } = navigation.state;
    params.onSelectMove(move);
    navigation.goBack();
  }

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;

    const pokemon = store.getPokemonByID(params.id);
    const attacks =
      params.moves === 'quick'
        ? getQuickAttacks(pokemon)
        : getSpecialAttacks(pokemon);
    const sprite = store.getSprite(pokemon.id);

    return (
      <ScrollView style={styles.modal}>
        <Image style={styles.image} source={sprite} />
        <View style={styles.padding}>
          <Heading level={1}>Select a Move</Heading>
          {attacks.map(move => {
            return (
              <TouchableItem
                key={move.Name}
                onPress={() => this.selectMove(move)}
                activeOpacity={0.7}
                style={styles.row}
              >
                <Attack move={move} types={pokemon.types} />
              </TouchableItem>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}
