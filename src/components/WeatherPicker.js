import React from 'react';
import { View } from 'react-native';
import PickerSelect from 'react-native-picker-select';

import Heading from './Heading';
import formatMove from '../utils/formatMove';

const WEATHER = [
  'SUNNY',
  'CLEAR',
  'PARTLY_CLOUDY',
  'CLOUDY',
  'RAIN',
  'SNOW',
  'WINDY',
  'FOGGY',
  'EXTREME',
].map(key => ({
  key,
  label: formatMove(key),
  value: key,
}));

export default class WeatherPicker extends React.PureComponent {
  render() {
    return (
      <View>
        <Heading>Weather</Heading>

        <PickerSelect
          hideIcon
          items={WEATHER}
          onValueChange={this.props.onWeatherChanged}
          value={this.props.weather}
        />
      </View>
    );
  }
}

WeatherPicker.defaultProps = {
  weather: 'EXTREME',
};
