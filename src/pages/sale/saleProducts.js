import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { ListItem, SearchBar, Button } from 'react-native-elements';
import { TextMask } from 'react-native-masked-text'
import database from '../../database/ProductSale';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheet/stylesheet';

const db = new database();
export default class SaleProducts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      update: false,
      saleProducts: [],
      notFound: 'Nenhum produto encontrado',
      idSale: '',
      search: ''      
    };    
    this.arrayholder = [];
  }

  componentDidMount() {        
    this.setState({
      idSale: this.props.route.params.id
    })
    this.getSaleProducts(this.props.route.params.id);  
  }  

  componentDidUpdate() {
    if(this.props.route.params.update) {
      this.props.route.params.update = false;
      this.getSaleProducts(this.state.idSale);
    }
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getSaleProducts() });
 }
  
  getSaleProducts(id) {
    let saleProducts = [];
    db.listProductSale(id).then((data) => {
      saleProducts = data;
      this.setState({
        saleProducts,
        isLoading: false,
      },
      function() {
        this.arrayholder = saleProducts;
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
      const itemData = item.product.name ? item.product.name.toUpperCase() : ''.toUpperCase();      
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      saleProducts: newData,
      search: text
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem      
      title={item.product.name + " - " + item.sellingWay.name}
      subtitle={
        <View>
          <View style={{ flexDirection: 'row'}}>
            <Text style={{ fontWeight: 'bold'}}>Valor de Venda: </Text>
            <TextMask
            value={item.productprice}
            type={'money'}
            options={{
                obfuscated: true,
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
                suffixUnit: ''
            }}
            />
          </View>
          <View style={{ flexDirection: 'row'}}>
            <Text style={{ fontWeight: 'bold'}}>Valor Líquido: </Text>
            <TextMask
            value={item.netprice}
            type={'money'}
            options={{
                obfuscated: true,
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
                suffixUnit: ''
            }}
            />
          </View>
        </View>
      }
      rightAvatar={{
        icon: { name: 'delete', color: 'red'}                     
      }}
      onPress={() => this.props.navigation.navigate('EditSaleProduct', {
        id: `${item._id}`
      })}                  
      onLongPress={() => Alert.alert(
        "Remover Produto",
        `Você tem certeza que deseja remover do carrinho o Produto ${item.product.name}?`,
        [
          {
            text: "Sim", 
            onPress: () => db.deleteProductSale(`${item._id}`).then(() => this.props.navigation.navigate('RegisterSale', {
              remove: true,
              productPrice: `${item.productprice}`,
              netPrice: `${item.netprice}`
            })),                         
          },
          {
            text: "Cancelar",                   
          }
        ],
        { cancelable: true }
      )}
      delayLongPress={1000}
      bottomDivider 
      chevron                 
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
    if(this.state.saleProducts.length === 0){
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
            onPress={() => this.props.navigation.navigate('RegisterSaleProduct', {
              id: `${this.state.idSale}`
            })}
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
    // if(this.props.route.params.update){            
    //   this.props.route.params.update = false;
    //   this.getSales();
    // }
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
          data={this.state.saleProducts}        
          refreshing={this.state.isLoading}
          onRefresh={() => this.onRefresh()}        
          renderItem={this.renderItem}
        />        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterSaleProduct', {
            id: `${this.state.idSale}`
          })}
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