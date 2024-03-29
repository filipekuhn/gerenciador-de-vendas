import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text, TouchableOpacity, Image } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import databaseCustomer from '../../database/Sale';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheet/stylesheet';

const db = new databaseCustomer();
export default class Sales extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      update: false,
      sales: [],
      notFound: 'Nenhuma venda encontrada',
      search: ''      
    };    
    this.arrayholder = [];
  }

  componentDidMount() {        
    this.getSales();  
  }  

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getSales() });
 }
  
  getSales() {
    let sales = [];
    db.listSales().then((data) => {
      sales = data;
      this.setState({
        sales,
        isLoading: false,
      },
      function() {
        this.arrayholder = sales;
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
      const itemData = item.customer.name ? item.customer.name.toUpperCase() : ''.toUpperCase();      
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      sales: newData,
      search: text
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem      
      title={item.customer.name}
      subtitle={item.date}
      leftAvatar={{        
        rounded: true,        
        size: "medium",               
        //source: require('../../images/users.png'), 
        icon: { name: 'shopping-cart', color: '#5390fe'},        
      }}
      rightAvatar={{
        //source: item.pendingpayment === 1 ? require('../../images/city.png') : require('../../images/users.png')
        icon: item.pendingpayment === 1 ? { name: 'money-off', color: 'red' } : { name: 'attach-money', color: 'green' }
      }}
      onPress={() => {
        this.props.navigation.navigate('RegisterSale', {
          id: `${item._id}`, 
          update: true         
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
    if(this.state.sales.length === 0){
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
            onPress={() => this.props.navigation.navigate('RegisterSale')}
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
      this.getSales();
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
          data={this.state.sales}        
          refreshing={this.state.isLoading}
          onRefresh={() => this.onRefresh()}        
          renderItem={this.renderItem}
        />        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterSale')}
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