import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import databaseSellingWay from '../database/SellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../stylesheet/stylesheet';

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