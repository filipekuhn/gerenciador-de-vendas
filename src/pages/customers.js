//import React, { Component, useEffect } from 'react';
import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button, Avatar } from 'react-native-elements';
import { useFocusEffect, useNavigation, useNavigationState, useRoute, navigationOptions } from '@react-navigation/native';
import databaseCustomer from '../database/Customer';
//import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const db = new databaseCustomer();
export default class Customers extends Component {

  static navigationOptions = {
    title: 'Clientes'
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      update: false,
      customers: [],
      notFound: 'Nenhum cliente encotrado'      
    };    
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
      title={item.name}
      subtitle={item.email}
      leftAvatar={{        
        rounded: true,
        showEditButton: true,
        size: "medium",
        //source: { uri: 'https://reactjs.org/logo-og.png'},        
        source: require('../images/users.png'), 
        title: item.name[0],        
      }}
      onPress={() => {
        this.props.navigation.navigate('Customer', {
          id: `${item._id}`                   
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
    if(this.state.customers.length === 0){
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
      this.getCustomers();
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList        
        keyExtractor={this.keyExtractor}
        data={this.state.customers}
        //extraData={this.state}
        refreshing={this.state.isLoading}
        onRefresh={() => this.onRefresh()}        
        renderItem={this.renderItem}
      />
        <Button
          icon={{name: 'account-circle', color: '#FFF'}}
          buttonStyle={styles.button}
          title="Cadastrar Cliente"
          onPress={ () => this.props.navigation.navigate('RegisterCustomer', {
            onGoBack: () => this.getCustomers()
          })} />
      </SafeAreaView>
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22
  },
  item: {
    padding: 5,
    fontSize: 20,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    padding: 16,
    fontSize: 18,
    color: '#5390fe'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#5390fe',
    color: '#5390fe',
    padding: 10,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 10,
    borderRadius: 70
  },
});