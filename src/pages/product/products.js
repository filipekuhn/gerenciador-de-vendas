//import React, { Component, useEffect } from 'react';
import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text, Image, TouchableOpacity } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import database from '../../database/Product';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheet/stylesheet';

const db = new database();
export default class Products extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      update: false,
      prodcuts: [],
      search: '',
      notFound: 'Nenhum produto encontrado'      
    };    
    this.arrayholder = [];
  }

  componentDidMount() {        
    this.getProducts();  
  }  

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getProducts() });
 }
  
  getProducts() {
    let products = [];
    db.listProducts().then((data) => {
      products = data;
      this.setState({
        products,
        isLoading: false,
      },
        function() {
          this.arrayholder = products;
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
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();      
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      products: newData,
      search: text
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem      
      title={item.name}
      subtitle={item.code}
      leftAvatar={{        
        rounded: true,
        showEditButton: true,
        size: "medium",
        //source: { uri: 'https://reactjs.org/logo-og.png'},        
        source: require('../../images/product.png'), 
        title: item.name[0],              
      }}
      onPress={() => {
        this.props.navigation.navigate('Product', {
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
    if(this.state.products.length === 0){
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
            onPress={() => this.props.navigation.navigate('RegisterProduct')}
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
      this.getProducts();
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
        data={this.state.products}        
        refreshing={this.state.isLoading}
        onRefresh={() => this.onRefresh()}        
        renderItem={this.renderItem}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterProduct')}
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