import React from 'react';
import { View, Text } from 'react-native';
import { ThemeProvider } from 'styled-components';
import SelectBox from 'react-native-multi-selectbox';
import { xor } from 'lodash';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}

export default class CitiesSelectBox extends React.Component {
  state = {
    selectedLocations: [
      {item: 'Guarapuava', id: 1}
    ],
    selectValues: [],
    locations: [
      {item: 'Guarapuava', id: 1},
      {item: 'Curitiba', id: 2}
    ]
  }

  render() {
    const { locations, selectedLocations, selectValues } = this.state
    return(
      <ThemeProvider theme={Colors}>
        <View style={{ margin: 30 }}>          
          <Text style={{ fontSize: 20, paddingBottom: 10 }}>Selecione a Cidade</Text>
          <SelectBox
            label=""            
            options={locations}            
            value={selectedLocations[0]}
            onChange={val => this.setState({ selectedLocations: [val]})}            
            hideInputFilter={false}
            viewMargin="0 0 20px 0"
          />
          
        </View>
      </ThemeProvider>
    );
  }
}

