import React, { Component } from 'react';
import { View, ScrollView ,FlatList, Image, KeyboardAvoidingView, Alert, Text, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import { Picker } from '@react-native-community/picker'
import { Button, ListItem } from 'react-native-elements';
import { TextMask } from 'react-native-masked-text'
import styles from '../../stylesheet/stylesheet';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import SaleDb from '../../database/Sale';
import CustomerDb from '../../database/Customer';
import ProductDb from '../../database/Product';
import ProductSaleDb from '../../database/ProductSale';
import SellingWayDb from '../../database/SellingWay';
import { TextInputMask } from 'react-native-masked-text';
import { or } from 'react-native-reanimated';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}

const Sale = new SaleDb();
const Customer = new CustomerDb();
const Product = new ProductDb();
const ProductSale = new ProductSaleDb();
const SellingWay = new SellingWayDb();


export default class RegisterSale extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      isLoading: true,
      id: '',
      date: '',       
      idcustomer: '', 
      idsellingway: '', 
      observations: '', 
      saleprice: '', 
      finalprice: '', 
      amountpaid: '',
      pendingpayment: '',                  
      selectedCustomer: { id: 0, item: '' },
      selectedSellingWay: { id: 0, item: '' },
      selectedProduct: {},
      productSale: [],
      sellingWays: [],
      customers: [],
      sale: {},
      productQuantity: 0,
      productNotFound: 'Nenhum produto foi adicionado'
    };          
  }

  componentDidMount() {  
    console.log("ID da rota: ", this.props.route.params.id);    
    if(this.props.route.params.id === '') {
      console.log("VENDA NOVA");
      let todayDate = moment(new Date()).format("DD/MM/YYYY");
      this.setState({
        date: todayDate,
        dateField: todayDate
      });  
      this.getCustomers();
      this.getSellingWays();
    } else {
      console.log("BUSCANDO A VENDA: ", this.state.id);
      this.setState({
        id: this.props.route.params.id
      });
      this.getSale(); 
      this.getSaleProductsQuantity(this.props.route.params.id)     
    }        
  }

  componentDidUpdate() {
    if(this.props.route.params.update === true) {
      this.props.route.params.update = false;
      this.getSale();
    }

    if(this.props.route.params?.remove === true) {
      this.props.route.params.remove = false;
      let updateSalePrice = parseFloat(this.state.saleprice) - parseFloat(this.props.route.params.productPrice);
      let updateFinalPrice = parseFloat(this.state.finalprice) - parseFloat(this.props.route.params.netPrice);
      
      updateSalePrice = parseFloat(updateSalePrice).toFixed(2);
      updateFinalPrice = parseFloat(updateFinalPrice).toFixed(2);

      // if(updateQuantity < 0){
      //   updateQuantity = 0;
      // }
      
      if(updateSalePrice < 0){
        updateSalePrice = 0;
      }

      if(updateFinalPrice < 0){
        updateFinalPrice = 0;
      }


      this.getSaleProductsQuantity(this.props.route.params.id);
      this.setState({
        saleprice: updateSalePrice,
        finalprice: updateFinalPrice,        
      })
    } 

    if(this.props.route.params?.add === true) {
      this.props.route.params.add = false;
      let salePrice = 0;
      let finalPrice = 0;

      console.log("SALE PRICE: ", this.state.saleprice, "..E AQUI a rota", this.props.route.params.productPrice);
      if(this.state.saleprice !== null){
        salePrice = this.state.saleprice;
      }

      if(this.state.finalprice !== null){
        finalPrice = this.state.finalprice;
      }

      let sumSalePrice = parseFloat(salePrice) + parseFloat(this.props.route.params.productPrice);
      let sumFinalPrice = parseFloat(finalPrice) + parseFloat(this.props.route.params.netPrice);   
      sumSalePrice = parseFloat(sumSalePrice).toFixed(2);
      sumFinalPrice = parseFloat(sumFinalPrice).toFixed(2);
      
      this.getSaleProductsQuantity(this.props.route.params.id);
      this.setState({
        saleprice: sumSalePrice,
        finalprice: sumFinalPrice,         
      })
    }    
  }

  getCustomers() {
    let customers = [{ id: 0, item: '' }];
    Customer.listCustomerItems().then((data) => {
      Array.prototype.push.apply(customers, data)      
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

  getSaleProductsQuantity(id) {
    ProductSale.listProductSale(id).then((data) => {
      let quantity = 0;
      quantity = data;
      this.setState({
        productQuantity: quantity.length,
        isLoading: false 
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getSellingWays() {    
    let sellingWays = [{ id: 0, item: '' }];
    SellingWay.listSellingWaysItems().then((data) => {            
      Array.prototype.push.apply(sellingWays, data);      
      this.setState({
        sellingWays,                       
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getProductSale() {
    let productSale = [];
    ProductSale.listProductSale(this.state.id).then((data) => {
      productSale = data;
      this.setState({
        productSale,                        
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });
  }

  getSale() {    
    Sale.findSaleById(this.props.route.params.id).then((data) => {   
      let sale = data;   
      this.setState({
        date: sale.date,       
        idcustomer: sale.idcustomer, 
        idsellingway: sale.idsellingway, 
        observations: sale.observations, 
        saleprice: sale.saleprice, 
        finalprice: sale.finalprice, 
        amountpaid: sale.amountpaid,
        pendingpayment: sale.pendingpayment,         
      });  
      this.getCustomer();  
      this.getSellingWay();
      this.getProductSales();  
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });

  }
  
  getCustomer() {
    Customer.findCustomerById(this.state.idcustomer).then((data) => {       
      let customer = data;     
      this.setState({
        selectedCustomer: [{
          id: customer._id,
          item: customer.name
        }],
        customers: [{
          id: customer._id,
          item: customer.name
        }]
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });    
  }    

  getSellingWay() {
    SellingWay.findSellingWayById(this.state.idsellingway).then((data) => {
      let sellingWay = data;
      this.setState({
        selectedSellingWay: [{
          id: sellingWay._id,
          item: sellingWay.name,          
        }],
        sellingWays: [{
          id: sellingWay._id,
          item: sellingWay.name,          
        }]
      })
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });
  }
   
  getProductSales() {
    ProductSale.listProductSale(this.state.id).then((data) => {
      let productSale = data;
      this.setState({
        productSale,
        isLoading: false
      })
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });   
  }
 
  shoppingCart() {
    if(this.state.id === '') {
      Alert.alert(
        "Carrinho",
        "Para adicionar produtos ao carrinho, é necessário que a venda esteja salva.\n\n Deseja salvar?",
        [
          {
            text: "Sim",
            onPress: () => this.saveSale(),                          
          },
          {
            text: "Não"
          }
        ],
        { cancelable: true }
      );          
    } else {
      this.props.navigation.navigate('SaleProducts', {
        id: `${this.state.id}`
      })
    }
  }
  

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveSale() {      
    this.setState({
      isLoading: true,      
    });          
    
    //let finalPrice = this.finalPriceField.getRawValue();
    //let salePrice = this.salePriceField.getRawValue();
    //let amountPaid = this.amountPaidField.getRawValue();

    let finalPrice = this.state.finalprice;
    finalPrice = String(finalPrice).replace("R$ ", "").replace(",", ".");
    let salePrice = this.state.saleprice;
    salePrice = String(salePrice).replace("R$ ", "").replace(",", ".");
    let amountPaid = this.state.amountpaid;
    amountPaid = String(amountPaid).replace("R$ ", "").replace(",", ".");

    let pending = true;
    let pendigPaymentValue = amountPaid - salePrice
    pendigPaymentValue = pendigPaymentValue.toFixed(2)

    if( pendigPaymentValue >= 0) {
      pending = false
    }

    let idCustomer = null;
    let idSellingway = null;
    let date = null ;

    if(!this.state.saleprice > 0) {
      salePrice = null;
    }

    if(!this.state.finalprice > 0) {
      finalPrice = null;
    }
    
    if(!this.state.amountpaid > 0) {
      amountPaid = null;
    }

    if(this.state.date !== '') {
      date = this.state.date;
    }

    // if(this.state.selectedCustomer[0].id > 0 ) {
    //   idCustomer = this.state.selectedCustomer[0].id;
    // }

    // if(this.state.selectedSellingWay[0].id > 0) {
    //   idSellingway = this.state.selectedSellingWay[0].id;
    // }

    if(this.state.selectedCustomer > 0 ) {
      idCustomer = this.state.selectedCustomer;
    }

    if(this.state.selectedSellingWay > 0) {
      idSellingway = this.state.selectedSellingWay;
    }
    
    if(!idCustomer > 0 || !idSellingway > 0){
      Alert.alert(
        "Erro",
        "É necessário selecionar um cliente e uma forma de venda",
        [
          {
            text: "OK",
            onPress: () => this.setState({ isLoading: false })            
          }
        ],
        { cancelable: true }
      )      
      return false
    }

    if(!this.dateField === null){
      if(!this.dateField.isValid()){    
        Alert.alert(
          "ERRO",
          "A data inserida como data de venda é inválida!",
          [
            {
              text: "OK"
            }
          ],
          { cancelable: true }
        )
        return false
      }    
    }
        
      let data = { 
      id: this.state.id,           
      date: date,       
      idcustomer: idCustomer, 
      idsellingway: idSellingway, 
      observations: this.state.observations, 
      saleprice: salePrice, 
      finalprice: finalPrice, 
      amountpaid: amountPaid,
      pendingpayment: pending
    }        
      Sale.addSale(data).then((result) => {      
        this.setState({
          isLoading: false,
        });
        
        if(result.insertId > 0) {          
          this.setState({ id: result.insertId });     
          Alert.alert(
            "Cadastro de Venda",
            "O Cadastro foi salvo com sucesso!",
            [
              {
                text: "OK",
                onPress: () => this.props.navigation.navigate('RegisterSale', {
                  id: `${result.insertId}`, 
                  update: true
                }),                          
              }
            ],
            { cancelable: true }
          );          
        }      
      }).catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
        Alert.alert(
          "Cadastro de Venda",
          "Não foi possível realizar o cadastro!\nVerifique se todos os campos foram preenchidos e se a data é válida!",
          [
            {
              text: "OK"                              
            }
          ],
          { cancelable: false }
        );
      });                   
  }

  updateSale() {

    this.setState({
      isLoading: true,      
    });          

    let finalPrice = this.state.finalprice;
    finalPrice = String(finalPrice).replace("R$ ", "").replace(",", ".");
    let salePrice = this.state.saleprice;
    salePrice = String(salePrice).replace("R$ ", "").replace(",", ".");
    let amountPaid = this.state.amountpaid;
    amountPaid = String(amountPaid).replace("R$ ", "").replace(",", ".");

    let pending = true;
    let pendigPaymentValue = amountPaid - salePrice
    pendigPaymentValue = pendigPaymentValue.toFixed(2)

    if( pendigPaymentValue >= 0) {
      pending = false
    }

    let idCustomer = null;
    let idSellingway = null;
    let date = null ;

    if(!this.state.saleprice > 0) {
      salePrice = null;
    }

    if(!this.state.finalprice > 0) {
      finalPrice = null;
    }
    
    if(!this.state.amountpaid > 0) {
      amountPaid = null;
    }

    if(this.state.date !== '') {
      date = this.state.date;
    }

    if(this.state.selectedCustomer[0].id > 0 ) {
      idCustomer = this.state.selectedCustomer[0].id;
    }

    if(this.state.selectedSellingWay[0].id > 0) {
      idSellingway = this.state.selectedSellingWay[0].id;
    }
    
    if(!this.dateField.isValid()){    
      Alert.alert(
        "ERRO",
        "A data inserida como data de venda é inválida!",
        [
          {
            text: "OK"
          }
        ],
        { cancelable: true }
      )
      return false
    }    
      let data = { 
      id: this.state.id,           
      date: date,       
      idcustomer: idCustomer, 
      idsellingway: idSellingway, 
      observations: this.state.observations, 
      saleprice: salePrice, 
      finalprice: finalPrice, 
      amountpaid: amountPaid,
      pendingpayment: pending
    }    

    Sale.editSale(data).then((result) => {      
      this.setState({
        isLoading: false,
      });
      if(true) {                  
        Alert.alert(
          "Cadastro de Venda",
          "As alterações foram salvas com sucesso!",
          [
            {
              text: "OK",
              onPress: () => this.props.navigation.navigate('Sales', {
                update: true
              })                          
            }
          ],
          { cancelable: true }
        );
      }      
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Venda",
        "Não foi possível realizar as alterações!\nVerifique se todos os campos foram preenchidos e se a data é válida!",
        [
          {
            text: "OK"                
          }
        ],
        { cancelable: false }
      );
    });
  }  

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getSale() });
  }

  render() {       
    if(this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }    
    return(             
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ backgroundColor: 'white', flex: 1 }}>              
          <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>
            Selecione o Cliente
          </Text>
          <Picker                                             
            style={{ width: 250, marginLeft: 15, fontWeight: "bold" }}
            selectedValue={this.state.selectedCustomer}                              
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selectedCustomer: itemValue })}>            
            {
              this.state.customers.map((item) => {
                return <Picker.Item label={item.item} value={item.id} key={item.id} />
              })   
            }             
          </Picker>
          <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>
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
          <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Data da Venda</Text>
          <TextInputMask
            placeholder={moment(new Date()).format("DD/MM/YYYY")}
            style={styles.textInput}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            value={this.state.date}
            onChangeText={(text) => this.updateTextInput(text, 'date')}  
            ref={(ref) => this.dateField = ref}              
          /> 
          <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Valor de Venda</Text>
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
          value={this.state.saleprice}
          onChangeText={(text) => this.updateTextInput(text, 'saleprice')}                  
          ref={(ref) => this.salePriceField = ref}              
        />
        <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Valor Líquido Final</Text>
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
          value={this.state.finalprice}
          onChangeText={(text) => this.updateTextInput(text, 'finalprice')}                
          ref={(ref) => this.finalPriceField = ref}
        />       
        <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Valor Pago</Text>
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
          value={this.state.amountpaid}
          onChangeText={(text) => this.updateTextInput(text, 'amountpaid')}                
          ref={(ref) => this.amountPaidField = ref}
        />           
        <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Observações</Text>
        <TextInput
          placeholder="Observações"
          multiline={true}
          style={styles.textInput}
          value={this.state.observations}
          onChangeText={(text) => this.updateTextInput(text, 'observations')}
        />
        <Button              
          icon={{ name: 'shopping-cart', color: 'white'}}
          title={`Carrinho (${this.state.productQuantity})`}
          buttonStyle={styles.button}
          onPress={() => this.shoppingCart()}
        />     
        {this.state.id === '' && (
          <Button
          icon={{name: 'save', color: '#FFF'}}         
          title="Gravar Venda"
          buttonStyle={styles.button}                
          onPress={() => this.saveSale()}
          /> 
        )}         

        {this.state.id !== '' && (
          <View>
          <Button
            icon={{name: 'save', color: '#FFF'}}         
            title="Salvar Venda"
            buttonStyle={styles.button}                
            onPress={() => this.updateSale()}
          /> 
          <Button
            icon={{ name: 'delete', color: '#FFF' }}
            title="Deletar"
            buttonStyle={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                "Exclusão de Venda",
                `Você tem certeza que deseja excluir a venda do cliente ${this.state.selectedCustomer[0].item}?`,
                [
                  {
                    text: "Sim",
                    onPress: () => Sale.deleteSaleById(this.state.id).then(() => this.props.navigation.navigate('Sales', {
                      update: true
                    }))
                  },
                  {
                    text: "Não"
                  }
                ],
                { cancelable: true }
              )
            }} />
            </View>
        )}
          {/* <Button
            icon={{ name: 'delete', color: '#FFF' }}
            title="Deletar"
            buttonStyle={styles.deleteButton}
            onPress={() => console.log("O ESTADO DE FINAL PRICE: ", this.state.selectedCustomer)} /> */}

        {/* <Button
          icon={{ name: 'arrow-back', color: 'white'}}
          title="Vendas"
          buttonStyle={{ marginLeft: 100, marginRight: 100, marginTop: 10, padding: 10, borderRadius: 80 }}
          onPress={() => this.props.navigation.navigate('Sales', { update: true })}
        />       */}                            
      </View> 
      </KeyboardAvoidingView>
    </ScrollView>
    );
  }  
}
