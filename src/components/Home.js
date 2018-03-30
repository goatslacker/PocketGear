/* @flow */

import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import PokemonChooser from './PokemonChooser';
import PokemonInfo from './PokemonInfo';
import PokeModal from './PokeModal';
import Arena from './Arena';

const Home = StackNavigator(
  {
    Main: { screen: PokemonChooser },
    Info: { screen: PokemonInfo },
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
  }
);

const Root = StackNavigator(
  {
    Main: {
      screen: Home,
    },
    Modal: {
      screen: PokeModal,
    },
    Arena: {
      screen: Arena,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
)

// eslint-disable-next-line jsx/no-bind
export default () => <Root onNavigationStateChange={() => {}} />;
