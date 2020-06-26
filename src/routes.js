import React from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';

import Main from './pages/main';
import Customer from './pages/customer';
import Customers from './pages/customers';
import Sale from './pages/sale';
import RegisterCustomer from './pages/RegisterCustomer';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" 
          component={Main} 
          options={{headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left'}} />
        <Stack.Screen name="Customer" 
          component={Customer} 
          options={{headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left'}} />
        <Stack.Screen name="Sales" 
          component={Sale} 
          options={{headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left'}} />
        <Stack.Screen name="RegisterCustomer" 
          component={RegisterCustomer} 
          options={{headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left'}} />
        <Stack.Screen name="Customers" 
          component={Customers} 
          options={{headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left'}} />
      </Stack.Navigator>                  
    </NavigationContainer>
  );
}

export default App;

