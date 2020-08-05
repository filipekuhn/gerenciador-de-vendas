import React, { Component } from 'react';
import { View, Text, Picker, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import styles from '../../stylesheet/stylesheet';
import Product from '../../database/Product';
import ProductSellingWay from '../../database/ProductSellingWay';

const ProductDB = new Product();
const ProductSellingWayDB = new ProductSellingWay();

export default class RegisterProductSale extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      selectedProduct: {},
      product: {},
      productSellingWays: [],
      salePrice: '',
      siteCommission: '',
      netPrice: ''
    }
  }

  componentDidMount() {
    this.getProduct();
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  getProduct() {
    let productSellingWays = [];
    ProductSellingWayDB.listProductsItems().then((data) => {
      productSellingWays = data;
      this.setState({
        productSellingWays,
        isLoading: false
      });
      console.log("OLHA AQUI CARAI: ", productSellingWays);
    }).catch((err) => {
      console.log(err);
    })
  }

  getValues(item) {
    this.setState({
      selectedProduct: item
    });

    let productValues = {};
    ProductSellingWayDB.findProductSellingWay(item).then((data) => {
      productValues = data;
      console.log("Tá aquiiiiiiiiiiii: ", productValues)
      this.setState({
        product: productValues,
        salePrice: productValues.saleprice,
        siteCommission: productValues.sitecommission,
        netPrice: productValues.netprice,
        isLoading: false        
      });
    })    
  }

  includeProduct() {
    let productSellingWaySale = {
      id: this.state.product._id,
      product: {
        id: this.state.product.idproduct,
        name: this.state.product.name,        
      },
      sellingWay: {
        id: this.state.product.idsellingway,
        name: this.state.product.sellingwayname
      },
      siteCommission: this.state.siteCommission,
      salePrice: this.state.salePrice,
      netPrice: this.state.netPrice
    };

    this.props.navigation.goBack({
      update: true,
      productSellingWaySale
    });
  }

  render() {
    return(
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
              
              <Text style={{ marginLeft: 20, marginTop: 10 }}>
                Selecione o Produto
              </Text>
              <Picker                                             
                style={{ width: 250, marginLeft: 15 }}
                selectedValue={this.state.selectedProduct}                              
                onValueChange={(itemValue, itemIndex, salePrice) =>
                  this.getValues(itemValue)
                }>            
                {
                  this.state.productSellingWays.map((item) => {
                    return <Picker.Item label={item.item} value={item.id} key={item.id} />                    
                  })                  
                }             
              </Picker>
              <Text style={{  marginLeft: 20 }}>Valor de Venda</Text>
              <TextInputMask       
                placeholder="R$ 0,00"         
                style={styles.textInput}
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}                
                value={this.state.salePrice}
                onChangeText={(text) => this.updateTextInput(text, 'salePrice')}                  
                ref={(ref) => this.salePriceField = ref}              
              />
              <Text style={{  marginLeft: 20 }}>Valor de Comissão do Site</Text>
              <TextInputMask                   
                placeholder="R$ 0,00"                             
                style={styles.textInput}
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}                
                value={this.state.siteCommission}
                onChangeText={(text) => this.updateTextInput(text, 'siteCommission')}                
                ref={(ref) => this.comissionField = ref}
              /> 
              <Text style={{  marginLeft: 20 }}>Valor líquido</Text>
              <TextInputMask 
                placeholder="R$ 0,00"               
                style={styles.textInput}
                type={'money'}  
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}   
                value={this.state.netPrice}
                enabled={false}              
              />                       
              <View style={{ marginLeft: 20}}>
                <Button
                  icon={{ name: 'save', color: '#FFF' }}                
                  title="Salvar"
                  buttonStyle={styles.button}                               
                  onPress={() => this.includeProduct()}                
                /> 
              </View>
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }  
}