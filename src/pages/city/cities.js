//import React, { Component, useEffect } from 'react';
import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button, SearchBar } from 'react-native-elements';
import Database from '../../database/City';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheet/stylesheet';
import { TextInput } from 'react-native-gesture-handler';

const db = new Database();
export default class Cities extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      update: false,
      cities: [],
      search: '',
      notFound: 'Nenhuma cidade encontrada'      
    };   
    this.arrayholder = []; 
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
      },
        function() {
          this.arrayholder= cities;
        }
      );
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  searchFilter(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.item ? item.item.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      cities: newData,
      search: text
    });
  }

  updateSearch = (search) => {
    this.setState({ search });    
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
    const { search } = this.state;

    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.state.cities.length === 0){
      return(
        <SafeAreaView style ={{ flex: 1 }}>
          <SearchBar
            containerStyle={{ backgroundColor: '#5390fe', 
              borderBottomColor: '#5390fe', 
              borderTopColor: '#5390fe',                                    
            }}
            inputContainerStyle={{ backgroundColor: '#FFF', marginLeft: 20, marginRight: 20, borderRadius: 30 }}          
            placeholder="Buscar..."
            onChangeText={(text) => this.searchFilter(text)}
            value={this.state.search}                    
          />
          <View>
            <Text style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold' }}>Nenhum item foi encontrado</Text>
          </View>
          <Button
            icon={{name: 'add-circle-outline', color: '#FFF'}}
            buttonStyle={styles.button}
            title="Cadastrar Cidade"
            onPress={ () => this.props.navigation.navigate('RegisterCity')} />
        </SafeAreaView>
      )
    }
    if(this.props.route.params.update){            
      this.props.route.params.update = false;
      this.getCities();
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SearchBar
          containerStyle={{ backgroundColor: '#5390fe', 
            borderBottomColor: '#5390fe', 
            borderTopColor: '#5390fe',                                    
          }}
          inputContainerStyle={{ backgroundColor: '#FFF', marginLeft: 20, marginRight: 20, borderRadius: 30 }}          
          placeholder="Buscar..."
          onChangeText={(text) => this.searchFilter(text)}
          value={this.state.search}                    
        />
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