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
  Image,
  DeviceEventEmitter,
  Clipboard,
  BackAndroid,
  ScrollView,
} from 'react-native';

import { SensorManager } from 'NativeModules';

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


SensorManager.startAccelerometer(100);
SensorManager.startGyroscope(100);
SensorManager.startThermometer(100);

export default class elevator extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      gyroscope: '',
      accelerometer: '',
      pressure: 0,
    };
  }

  componentDidMount() {

    const self = this;

    BackAndroid.addEventListener('hardwareBackPress', function() {
     return true;
    });


    const { webviewbridge } = this.refs;
    // setInterval(function(){
    //   webviewbridge.sendToBridge("hello");
    // }, 1000)


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

  }

  // onBridgeMessage(message){
  //   const { webviewbridge } = this.refs;

  //   switch (message) {
  //     case "hello from webview":
  //       webviewbridge.sendToBridge("hello from react-native");
  //       break;
  //     case "got the message inside webview":
  //       console.log("we have got a message from webview! yeah");
  //       break;
  //   }
  // }


  render() {
    var rand = Math.random();
    return (
      <WebViewBridge
        ref="webviewbridge"
        // onBridgeMessage={this.onBridgeMessage.bind(this)}
        injectedJavaScript={injectScript}
        // injectedJavaScript={""}
        source={{uri: "http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/index.html?r="+rand}}/>
    );
  }

  // render() {
  //   return (
  //     <View style={styles.container}>

  //     {
  //       // <Text>{'PRESSURE'}</Text>
  //       // <Text style={[styles.instructions,{backgroundColor:this.state.gyroscopeXColor}]}>
  //       //   {this.state.gyroscopeX}
  //       // </Text>
  //       // <Text style={[styles.instructions,{backgroundColor:this.state.gyroscopeYColor}]}>
  //       //   {this.state.gyroscopeY}
  //       // </Text>
  //       // <Text style={[styles.instructions,{backgroundColor:this.state.gyroscopeZColor}]}>
  //       //   {this.state.gyroscopeZ}
  //       // </Text>
  //     }
  //       <Text>{'ACCELEROMETER'}</Text>
  //       <Text style={[styles.instructions,{backgroundColor:this.state.accelerometerXColor}]}>
  //         {this.state.accelerometerX}
  //       </Text>
  //       <Text style={[styles.instructions,{backgroundColor:this.state.accelerometerYColor}]}>
  //         {this.state.accelerometerY}
  //       </Text>
  //       <Text style={[styles.instructions,{backgroundColor:this.state.accelerometerZColor}]}>
  //         {this.state.accelerometerZ}
  //       </Text>
  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    width: 200,
    fontSize: 22,
    textAlign: 'right',
    paddingRight: 1,
  },
});

AppRegistry.registerComponent('elevator', () => elevator);
