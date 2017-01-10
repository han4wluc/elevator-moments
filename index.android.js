/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import WebViewBridge from 'react-native-webview-bridge';

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


// UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


import { SensorManager } from 'NativeModules';

SensorManager.startAccelerometer(100);
SensorManager.startGyroscope(100);
SensorManager.startThermometer(100);

const injectScript = `
  (function () {
    if (WebViewBridge) {
      console.log('brigestarted')
      WebViewBridge.onMessage = function (message) {
        console.log('onmessage')
        if (message === "hello from react-native") {
          WebViewBridge.send("got the message inside webview");
        }
      };

      WebViewBridge.send("hello from webview");
    }
  }());
`;


// SensorManager.startAccelerometer(100);
// SensorManager.startGyroscope(100);
// SensorManager.startThermometer(100);

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


    const { webviewbridge } = this.refs;
    // setInterval(function(){
    //   webviewbridge.sendToBridge("hello");
    // }, 1000)

    const self = this;

    var round = function(x){
      return Math.round(x * 1000)
    }

    var getColor = function(a, b, diff){
      a = round(a)
      // b = round(b)
      if(Math.abs(a - b) < diff){
        return 'white'
      }
      if(a == b){
        return 'white'
      }
      if(a > b){
        return 'green'
      } else {
        return 'red'
      }
    }

    const arr = [];

    var pressure = undefined;
    var acceleration = undefined;
    var temperature = undefined;

    DeviceEventEmitter.addListener('Thermometer', function (data) {
      temperature = data.temp;
    });


    DeviceEventEmitter.addListener('Gyroscope', function (data) {
      pressure = Math.round(data.x * 1000);
      // webviewbridge.sendToBridge(round(data.x));
      // arr.push(round(data.x)+'')
      // if(arr.length % 100 == 0){
      //   Clipboard.setString(JSON.stringify(arr))
      // }
      // self.setState({
      //   gyroscopeX: Math.round(data.x * 1000),
      //   gyroscopeXColor: getColor(data.x, self.state.gyroscopeX, 30),
      //   gyroscopeY: data.y,
      //   gyroscopeYColor: getColor(data.y, self.state.gyroscopeY, 30),
      //   gyroscopeZ: data.z,
      //   gyroscopeZColor: getColor(data.z, self.state.gyroscopeZ, 30),
      // })
    });


    DeviceEventEmitter.addListener('Accelerometer', function (data) {
      acceleration = round(data.y);
      // webviewbridge.sendToBridge(round(data.y)+'');
      // arr.push(round(data.y)+'')
      // if(arr.length % 100 == 0){
      //   Clipboard.setString(JSON.stringify(arr))
      // }
      // self.setState({
      //   accelerometerX: round(data.x),
      //   accelerometerXColor: getColor(data.x, self.state.accelerometerX, 30),
      //   accelerometerY: round(data.y),
      //   accelerometerYColor: getColor(data.y, self.state.accelerometerY, 30),
      //   accelerometerZ: round(data.z),
      //   accelerometerZColor: getColor(data.z, self.state.accelerometerZ, 30),
      // })
    });

    // setTimeout(function(){
      setInterval(function(){
        arr.push({
          p: pressure,
          a: acceleration,
          t: temperature,
        })
        if(arr.length % 100 == 0){
          Clipboard.setString(JSON.stringify(arr))
        }
        // webviewbridge.sendToBridge(JSON.stringify({
        //   p: pressure,
        //   a: acceleration,
        //   t: temperature,
        // }));
        // webviewbridge.sendToBridge('hellow');
      },100)
    // },2000)

    // setTimeout(function(){
    //   // LayoutAnimation.easeInEaseOut();
    //   LayoutAnimation.configureNext(
    //   { duration:30000,
    //     create:{type:'easeOut',property:'opacity'},
    //     update:{type:'easeOut'}
    //   });
    //   self.setState({
    //     top: -200000
    //   })
    // },1000)



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
            top: 20,
            right: 20,
            backgroundColor: 'red'
          }}
          onPress={()=>{
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
