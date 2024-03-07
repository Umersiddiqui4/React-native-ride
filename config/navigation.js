import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Screen1 from '../src/screen/Screen1';
import Screen2 from '../src/screen/Screen2';
import { NavigationContainer } from '@react-navigation/native';
import SearchLoc from '../src/screen/SearchLoc';

const Stack = createStackNavigator();

function Navigator() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Screen1} />
      <Stack.Screen name="House" component={Screen2} />
      <Stack.Screen  options={{ presentation: 'transparentModal' }} name="Search" component={SearchLoc} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
