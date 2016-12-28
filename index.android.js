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
// SensorManager.startGyroscope(1000);

export default class elevator extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      gyroscope: '',
      accelerometer: ''
    };
  }

  componentDidMount() {
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

    // DeviceEventEmitter.addListener('Gyroscope', function (data) {
    //   self.setState({
    //     gyroscopeX: round(data.x),
    //     gyroscopeXColor: getColor(data.x, self.state.gyroscopeX, 30),
    //     gyroscopeY: round(data.y),
    //     gyroscopeYColor: getColor(data.y, self.state.gyroscopeY, 30),
    //     gyroscopeZ: round(data.z),
    //     gyroscopeZColor: getColor(data.z, self.state.gyroscopeZ, 30),
    //   })
    // });    

    const arr = [];

    DeviceEventEmitter.addListener('Accelerometer', function (data) {
      webviewbridge.sendToBridge(round(data.y)+'');
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
        source={{uri: "http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/index.html?r="+rand}}/>
    );
  }

  // render() {
  //   return (
  //     <View style={styles.container}>
  //     {
  //       // <Text>{'GRAVITY'}</Text>
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
