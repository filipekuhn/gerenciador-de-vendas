import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text';
import styles from '../../stylesheet/stylesheet';
import { Picker } from '@react-native-community/picker';
import ProductSellingWay from '../../database/ProductSellingWay';
import Product from '../../database/Product';
import SellingWay from '../../database/SellingWay';
import moment from 'moment';

const db = new ProductSellingWay();
const dbProduct = new Product();
const dbSellingWay = new SellingWay();

export default class RegisterProductSellingWay extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      isLoading: true,
      currentLabel: 'Seleciona o meio de venda',
      idProduct: '',
      idSellingWay: '',      
      siteInclusionDate: '',
      salePrice: '',
      siteCommission: '',
      netPrice: '',
      product: {},
      selectedSellingWay: '',
      sellingWays: []
    };      
    
  }

  componentDidMount() {     
    this.getProductSellingWay();
  }
  
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  getProductSellingWay() {
    let product = {};
    let sellingWays = [];
    let idProduct = this.props.route.params.id

    dbProduct.findProductById(idProduct).then((data) => {
      product = data;
      this.setState({
        product: product,
        idProduct: idProduct
      });
    });

    dbSellingWay.listSellingWaysItems().then((data) => {
      sellingWays = data;
      this.setState({
        sellingWays: sellingWays,
        isLoading: false
      });
    });
  }

  saveProductSellingWay() {
    console.log("OPABAO", this.state.selectedSellingWay);
    this.setState({
      isLoading: true,      
    });    
    if(this.siteInclusionDateField.isValid()){

    } else {
      Alert.alert(
        "Cadastro de Valores de Produto",
        "A data inserida como data de cadastro no site é inválida!",
        [
          {
            text: "OK"
          }
        ],
        { cancelable: true }
      )
    }
    let netPriceValue = this.salePriceField.getRawValue() - this.comissionField.getRawValue();
    netPriceValue = netPriceValue.toFixed(2);
    let data = {      
      idProduct: this.state.idProduct,
      idSellingWay: this.state.selectedSellingWay,
      siteInclusionDate: this.state.siteInclusionDate,
      salePrice: this.salePriceField.getRawValue(),
      siteCommission: this.comissionField.getRawValue(),
      netPrice: netPriceValue
    }
    db.addProductSellingWay(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Produtos",
        "O Cadastro foi salvo com sucesso!",
        [
          {
            text: "OK", 
            icon: "done",
            onPress: () => this.props.navigation.navigate('Product', {
              id: this.state.idProduct,
              update: true
            }),            
          }
        ],
        { cancelable: false }
      );      
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
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
                Selecione o Meio de Venda
              </Text>
              <Picker                                             
                style={{ width: 250, marginLeft: 15 }}
                selectedValue={this.state.selectedSellingWay}                              
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedSellingWay: itemValue })}>            
                {
                  this.state.sellingWays.map((item) => {
                    return <Picker.Item label={item.item} value={item.id} key={item.id} />
                  })   
                }             
              </Picker>
              <Text>Data de inclusão no Site</Text>
              <TextInputMask
                placeholder={moment(new Date()).format("DD/MM/YYYY")}
                style={styles.textInput}
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY'
                }}
                value={this.state.siteInclusionDate}
                onChangeText={(text) => this.updateTextInput(text, 'siteInclusionDate')}  
                ref={(ref) => this.siteInclusionDateField = ref}              
              />       
              <Text>Valor de Venda</Text>
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
              <Text>Valor de Comissão do Site</Text>
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
              <Text>Valor líquido</Text>
              <TextInputMask                
                style={styles.textInput}
                type={'money'}  
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                  suffixUnit: ''
                }}   
                value={this.state.netPrice}
                enabled={false}              
              />                       
     
              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Cadastrar"
                buttonStyle={styles.button}                
                onPress={() => this.saveProductSellingWay()}                
              />
              <Text>
                {this.state.selectedSellingWay.id}
              </Text>  
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}