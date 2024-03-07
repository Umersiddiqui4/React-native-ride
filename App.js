import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Sreen1 from './src/screen/Screen1'
import Navigator from './config/navigation';
export default function App() {
  
  return (
    <View style={styles.container}>
      <Navigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
