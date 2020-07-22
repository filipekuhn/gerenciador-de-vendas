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

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notFound: 'Please click (+) button to add it.'      
    };    
  }

  componentDidMount() {
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

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getSellingWays() });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}      
      leftAvatar={{
        rounded: false,
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
    if(this.props.route.params.update){
      this.props.route.params.update = false;
      this.getSellingWays();
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.sellingways}
        refreshing={this.state.isLoading}
        onRefresh={() => this.onRefresh()}
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