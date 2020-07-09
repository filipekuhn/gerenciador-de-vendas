import React from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';

import Main from './pages/main';
import Customer from './pages/customer';
import Customers from './pages/customers';
import Sale from './pages/sale';
import RegisterCustomer from './pages/registerCustomer';
import SellingWay from './pages/sellingWay';
import SellingWays from './pages/sellingWays';
import RegisterSellingWay from './pages/registerSellingWay';
import FileFormat from './pages/fileFormat';
import FileFormats from './pages/fileFormats';
import RegisterFileFormat from './pages/registerFileFormat';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" 
          component={Main} 
          options={{ title: "Menu Principal", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="Customer" 
          component={Customer} 
          options={{  title: "Clientes", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} /> 
        
        <Stack.Screen name="Sales" 
          component={Sale} 
          options={{ title: "Vendas", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="RegisterCustomer" 
          component={RegisterCustomer} 
          options={{ title: "Cliente", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="Customers" 
          component={Customers} 
          options={{ title: "Clientes", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} 
          initialParams={{ update: false }}/>
        
        <Stack.Screen name="SellingWay" 
          component={SellingWay} 
          options={{ title: "Forma de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="SellingWays" 
          component={SellingWays} 
          options={{ title: "Formas de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="RegisterSellingWay" 
          component={RegisterSellingWay} 
          options={{ title: "Forma de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="FileFormat" 
          component={FileFormat} 
          options={{ title: "Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="FileFormats" 
          component={FileFormats} 
          options={{ title: "Formatos de Arquivos", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />                  
        
        <Stack.Screen name="RegisterFileFormat" 
          component={RegisterFileFormat} 
          options={{ title: "Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

      </Stack.Navigator>                  
    </NavigationContainer>
  );
}

export default App;

