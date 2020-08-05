import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text, TouchableOpacity, Image } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import databaseCustomer from '../../database/Customer';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheet/stylesheet';

const db = new databaseCustomer();
export default class Customers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      update: false,
      customers: [],
      notFound: 'Nenhum cliente encotrado',
      search: ''      
    };    
    this.arrayholder = [];
  }

  componentDidMount() {        
    this.getCustomers();  
  }  

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getCustomers() });
 }
  
  getCustomers() {
    let customers = [];
    db.listCustomer().then((data) => {
      customers = data;
      this.setState({
        customers,
        isLoading: false,
      },
      function() {
        this.arrayholder = customers;
        }
      );
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });    
  }

  searchFilter(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();      
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      customers: newData,
      search: text
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem      
      title={item.name}
      subtitle={item.email}
      leftAvatar={{        
        rounded: true,        
        size: "large",               
        //source: require('../../images/users.png'), 
        icon: { name: 'person', color: 'black'}             
      }}
      onPress={() => {
        this.props.navigation.navigate('Customer', {
          id: `${item._id}`,          
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
    if(this.state.customers.length === 0){
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
          <Text style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold' }}>{this.state.notFound}</Text>
          </View>
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => this.props.navigation.navigate('RegisterCustomer')}
            title="+"
            style={styles.touchableOpacityStyle}>
              <Image
                source={require('../../images/add2.png')}
                style={styles.floatingButtonStyle}
                />
            </TouchableOpacity>
        </SafeAreaView>
      )
    }
    if(this.props.route.params.update){            
      this.props.route.params.update = false;
      this.getCustomers();
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
          data={this.state.customers}        
          refreshing={this.state.isLoading}
          onRefresh={() => this.onRefresh()}        
          renderItem={this.renderItem}
        />        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterCustomer')}
          title="+"
          style={styles.touchableOpacityStyle}>
            <Image
              source={require('../../images/add2.png')}
              style={styles.floatingButtonStyle}
              />
        </TouchableOpacity>
      </SafeAreaView>            
    );
  }
}


/*<Button
icon={{name: 'account-circle', color: '#FFF'}}
buttonStyle={styles.button}
title="Cadastrar Cliente"
onPress={ () => this.props.navigation.navigate('RegisterCustomer')} />

<Icon
name="add-circle-outline"              
color="#FFF"       
style={styles.floatingButtonStyle}       
/> */