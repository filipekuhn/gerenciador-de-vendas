//import React, { Component, useEffect } from 'react';
import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button, Avatar } from 'react-native-elements';
import Database from '../../database/City';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheet/stylesheet';

const db = new Database();
export default class Cities extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      update: false,
      cities: [],
      notFound: 'Nenhuma cidade encontrada'      
    };    
  }

  componentDidMount() {        
    this.getCities();  
  }  

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getCities() });
 }
  
  getCities() {
    let cities = [];
    db.listCities().then((data) => {
      cities = data;
      this.setState({
        cities,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem      
      title={item.item}      
      leftAvatar={{        
        rounded: true,
        showEditButton: true,
        size: "medium",
        //source: { uri: 'https://reactjs.org/logo-og.png'},        
        source: require('../../images/city.png'), 
        title: item.item[0],        
      }}
      onPress={() => {
        this.props.navigation.navigate('City', {
          id: `${item.id}`,                           
        });
      }}
      chevron
      bottomDivider
    />    
  )

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.state.cities.length === 0){
      return(
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>          
          <Button
            buttonStyle={styles.button}
            title="Adicionar Clientes"
            onPress={ () => this.props.navigation.navigate('RegisterCustomer', {
              onGoBack: () => this.getCustomers()
            })} />
        </View>                
      )
    }
    if(this.props.route.params.update){            
      this.props.route.params.update = false;
      this.getCities();
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList        
        keyExtractor={this.keyExtractor}
        data={this.state.cities}        
        refreshing={this.state.isLoading}
        onRefresh={() => this.onRefresh()}        
        renderItem={this.renderItem}
      />
        <Button
          icon={{name: 'add-circle-outline', color: '#FFF'}}
          buttonStyle={styles.button}
          title="Cadastrar Cidade"
          onPress={ () => this.props.navigation.navigate('RegisterCity', {            
          })} />
      </SafeAreaView>            
    );
  }
}