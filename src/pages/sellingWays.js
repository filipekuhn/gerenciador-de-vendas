import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database from '../database/Database';
import databaseSellingWay from '../database/SellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//const db = new Database();
const db = new databaseSellingWay();


export default class SellingWays extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Formas de Venda',
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { 
            navigation.navigate('RegisterSellingWay', {
              onNavigateBack: this.handleOnNavigateBack
            }); 
          }}
        />
      ),
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      notFound: 'Please click (+) button to add it.'      
    };    
  }

  componentDidMount() {
    /*this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getSellingWays();
    });*/
    this.getSellingWays();      
  }

  getSellingWays() {
    let sellingways = [];
    db.listSellingWays().then((data) => {
      sellingways = data;
      this.setState({
        sellingways,
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
      leftAvatar={{
        source: require('../images/sellingway.png'),
        title: item.name[0],        
      }}
      onPress={() => {
        this.props.navigation.navigate('SellingWay', {
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
    if(this.state.sellingways.length === 0){
      return(
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>          
          <Button
            buttonStyle={styles.button}
            title="Adicionar Formas de Venda"
            onPress={ () => this.props.navigation.navigate('RegisterSellingWay')} />
        </View>
        
        
      )
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.sellingways}
        renderItem={this.renderItem}
      />
        <Button
          buttonStyle={styles.button}
          icon={{name: 'add-circle-outline', color: '#FFF'}}
          title="Cadastrar Forma de Venda"
          onPress={ () => this.props.navigation.navigate('RegisterSellingWay')} />
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
    padding: 10,
    fontSize: 18,
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