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
  LayoutAnimation,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';


UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


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
      // top: 0,
      top: new Animated.Value(0),
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

  scrollTop() {
    // console.warn('scrollTop')
    // LayoutAnimation.configureNext(
    //   { duration:3000,
    //     create:{type:'easeOut',property:'opacity'},
    //     update:{type:'easeOut'}
    //   });
    // this.setState({
    //   top: -2000
    // })


    this.animation = Animated.timing(          // Uses easing functions
       this.state.top,    // The value to drive
       {toValue: -100000,
       duration: 20000,
       easing:Easing.inOut(Easing.ease)}            // Configuration
     ).start();                // Don't forget start!
  }

  stop() {
    // console.warn('stop')
    // LayoutAnimation.configureNext(
    // { duration:10,
    //   create:{type:'easeOut',property:'opacity'},
    //   update:{type:'easeOut'}
    // });
    // this.setState({
    //   top: this.state.top
    // })

    // console.warn(this.state.top._value)
    

    this.state.top.stopAnimation();

    // const self = this;

    // this.myView.measure( (fx, fy, width, height, px, py) => {

    //     // console.warn('Component width is: ' + width)
    //     // console.warn('Component height is: ' + height)
    //     console.warn('X offset to frame: ' + fx)
    //     console.warn('Y offset to frame: ' + fy)
    //     // console.warn('X offset to page: ' + px)
    //     console.warn('Y offset to page: ' + py)
    // })

  }

  scrollBottom() {

    this.animation = Animated.timing(          // Uses easing functions
       this.state.top,    // The value to drive
       {toValue: 0,
       duration: 20000,
       easing:Easing.inOut(Easing.ease)}            // Configuration
     ).start();                // Don't forget start!

    // console.warn('scrollBottom')
    // LayoutAnimation.configureNext(
    // { duration:3000,
    //   create:{type:'easeOut',property:'opacity'},
    //   update:{type:'easeOut'}
    // });
    // this.setState({
    //   top: 100
    // })

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


  // render() {
  //   var rand = Math.random();
  //   return (
  //     <WebViewBridge
  //       ref="webviewbridge"
  //       // onBridgeMessage={this.onBridgeMessage.bind(this)}
  //       injectedJavaScript={injectScript}
  //       // injectedJavaScript={""}
  //       source={{uri: "http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/index.html?r="+rand}}/>
  //   );
  // }

  render() {
    return (
      <View>

        <Animated.View
          onLayout={()=>{

          }}
          ref={(myView)=>{this.myView=myView}}
          style={{
            position: 'absolute',
            top: this.state.top,
            left:0,
          }}
        >

        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
       <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />
        <Image
          style={{width: 360, height: 1500}}
          source={{uri: 'http://ml1.oss-cn-hongkong.aliyuncs.com/art/web/test_1.jpg'}}
        />

        </Animated.View>



        <TouchableOpacity
          onPress={this.scrollBottom.bind(this)}
          style={{
            position: 'absolute',
            top: 80,
            left:20,
            width: 200,
            height: 20,
            backgroundColor: '#ccc',
          }}
        >
          <Text>{'ScrollTop'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.stop.bind(this)}
          style={{
            position: 'absolute',
            top: 50,
            left:20,
            width: 200,
            height: 20,
            backgroundColor: '#ccc',
          }}
        >
          <Text>{'Stop'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.scrollTop.bind(this)}
          style={{
            position: 'absolute',
            top: 20,
            left:20,
            width: 200,
            height: 20,
            backgroundColor: '#ccc'
          }}
        >
          <Text>{'ScrollBottom'}</Text>
        </TouchableOpacity>


      </View>
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
