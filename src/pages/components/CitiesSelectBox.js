import React from 'react';
import { View, Text } from 'react-native';
import { ThemeProvider } from 'styled-components';
import SelectBox from 'react-native-multi-selectbox';
import Database from '../../database/City';
import { xor } from 'lodash';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}

const db = new Database();
export default class CitiesSelectBox extends React.Component {
  state = {
    //selectedLocations: Cities.cities,  
    selectValues: [],    
    locations: db.listCities()    
  }

  

  render() {
    const { locations, selectedLocations, selectValues } = this.state
      
    return(
      <ThemeProvider theme={Colors}>
        <View style={{ margin: 30 }}>          
          <Text style={{ fontSize: 15, paddingBottom: 10 }}>Selecione a Cidade</Text>
          <SelectBox
            label=""            
            options={locations}            
            value={locations[0]}
            onChange={val => this.setState({ locations: [val]})}            
            hideInputFilter={false}
            viewMargin="0 0 20px 0"
          />
          
        </View>
      </ThemeProvider>
    );
  }
}

