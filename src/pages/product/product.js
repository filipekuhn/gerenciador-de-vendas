import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Alert, FlatList, TouchableOpacity, Image } from 'react-native';
import { Card, Button, ListItem } from 'react-native-elements';
import Database from '../../database/Product';
import ProductSellingWay from '../../database/ProductSellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextMask } from 'react-native-masked-text';

const db = new Database();
const dbProductSellingWay = new ProductSellingWay();

export default class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      product: {},
      id: '',  
      productSellingWays: []    
    };      
  }
  

 componentDidMount() {
      this.getProduct();
  }  

  getProduct() {
    let product = {};     
    let productSellingWays = [];
    const { id } = this.props.route.params;    
    db.findProductById(id).then((data) => {      
      product = data;      
      this.setState({
        product,        
        id: product._id
      });            
      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });
    dbProductSellingWay.listProductSellingWay(id).then((data) => {
      productSellingWays = data;    
      this.setState({
        productSellingWays,
        isLoading: false
      });      
    });  
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getProduct() });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem                        
      title={item.sellingWay.name}
      titleStyle={{ fontWeight: "bold", fontSize: 18 }}                  
      //subtitle={"Valor de Venda: " + l.saleprice + "\nComissão do Site: " + l.sitecommission + "\nValor Líquido: " + l.netprice}                  
      subtitle={
        <View>
          <View style={{ flexDirection: 'row'}}>
            <Text style={{ fontWeight: 'bold'}}>Valor de Venda: </Text>
            <TextMask
            value={item.saleprice}
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
            <Text style={{ fontWeight: 'bold'}}>Comissão do Site: </Text>
            <TextMask
            value={item.sitecommission}
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
      onPress={() => this.props.navigation.navigate('EditProductSellingWay', {
        id: `${item._id}`,
        idProduct: `${item.product.idproduct}`,
        sellingWay: `${item.sellingWay.name}`
      })}                  
      onLongPress={() => Alert.alert(
        "Exclusão de Valores de Produto",
        `Você tem certeza que deseja excluir o Valor de Produto ${item.sellingWay.name}?`,
        [
          {
            text: "Sim", 
            onPress: () => dbProductSellingWay.deleteProductSellingWay(`${item._id}`).then((result) => {
              if(result){
                this.onRefresh()
              } else {
                Alert.alert(
                  "Exclusão de Valor de Produto",
                  `O Valor de Produto ${item.sellingWay.name} não pode ser excluído pois já participa de pelo menos uma venda`,
                  [
                    {
                      text: "OK"
                    },                    
                  ],
                  { cancelable: false }
                )
              }
            }),                         
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
    const getHeader = () => {
      return <View>
            <Card>          
            <View style={{ flexDirection: "row" }}>  
              <Text style={{ fontWeight: "bold" }}>Produto: </Text>
              <Text>{this.state.product.name}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>  
              <Text style={{ fontWeight: "bold" }}>Código: </Text>
              <Text>{this.state.product.code}</Text>
            </View>    
            <View style={{ flexDirection: "row" }}>  
              <Text style={{ fontWeight: "bold" }}>Medidas: </Text>
              <Text>{this.state.product.measures}</Text>
            </View>  
            <View style={{ flexDirection: "row" }}>
            <View style={{ width: 150 }}>
              <Button
                buttonStyle={styles.editRowButton}
                icon={{name: 'edit', color: '#FFF'}}
                title='Editar'
                onPress={() => this.props.navigation.navigate('EditProduct', {
                  id: `${this.state.id}`
                }) } />
            </View>
            <View style={{ width: 150 }}>
              <Button
                buttonStyle={styles.deleteRowButton}
                icon={{name: 'delete', color: '#FFF'}}
                title='Deletar'
                onPress={() => Alert.alert(
                  "Exclusão de Produto",
                  `Você tem certeza que deseja excluir o produto ${this.state.product.name}?`,
                  [
                    {
                      text: "Sim", 
                      onPress: () => db.deleteProductById(this.state.id).then((result) =>  {
                        if(result){
                          this.props.navigation.navigate('Products', {
                            update: true
                          })
                        } else {
                          Alert.alert(
                            "Exclusão de Produto",
                            `O produto ${this.state.product.name} não pode ser excluído pois já participa de pelo menos uma venda`,
                            [
                              {
                                text: "OK"
                              }
                            ],
                            { cancelable: false }
                          )
                        }
                      }), 
                      icon: "done"
                    },
                    {
                      text: "Cancelar",                   
                    }
                  ],
                  { cancelable: true }
                )}
              />
            </View>
          </View>
        </Card>

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5, alignSelf: 'center' }}>
            Valores do Produto
          </Text>
        </View>
      </View>
    };

    if(this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.props.route.params.update){
      this.props.route.params.update = false;
      this.getProduct();
    }
    return (      
      <SafeAreaView style={{ flex: 1 }}>                        
        <FlatList        
          keyExtractor={this.keyExtractor}
          data={this.state.productSellingWays}        
          refreshing={this.state.isLoading}
          onRefresh={() => this.onRefresh()}        
          renderItem={this.renderItem}
          ListHeaderComponent={getHeader}
        />                
             
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterProductSellingWay', {
            id: `${this.state.id}`,
            name: `${this.state.product.name}`
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
}