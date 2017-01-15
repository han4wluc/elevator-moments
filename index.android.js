/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  Clipboard,
  BackAndroid,
  LayoutAnimation,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
} from 'react-native';

import Elevator from './app/elevator.container';
import Settings from './app/settings.container';


import { SensorManager } from 'NativeModules';

SensorManager.startAccelerometer(100);
SensorManager.startGyroscope(100);
SensorManager.startThermometer(100);

export default class elevator extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      // gyroscope: '',
      // accelerometer: '',
      // pressure: 0,
      // top: 0,
      // top: new Animated.Value(0),
      // showSettings: true,
      showSettings: false,
    };
  }

  componentDidMount() {

    BackAndroid.addEventListener('hardwareBackPress', function() {
     return true;
    });

  }


  render() {
    return (
      <View>
        {this.state.showSettings ?  <Settings/> : <Elevator/>}

        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            top: 0,
            right: 0,
            // backgroundColor: 'red'
          }}
          onLongPress={()=>{
            this.setState({
              showSettings: !this.state.showSettings
            })
          }}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('elevator', () => elevator);
