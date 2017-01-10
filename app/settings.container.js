
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';

// pressures = {
//   8: 200,
//   7: 200,
//   6: 200,
  
// }


import Button from './Button';

import {
  getLocalFloorPressure,
  setLocalFloorPressure,
} from './Utils';


const getRange = function(min, max){
  var range = [];
  for (var i=max;i>=min;i--){
    range.push(i)
  }
  return range;
}

class Settings extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      elevatorSettings: undefined,
      minFloor: undefined,
      maxFloor: undefined,
    };
  }

  async componentDidMount() {

    let self = this;

    let elevatorSettings = await getLocalFloorPressure();

    // let elevatorSettings = {
    //   // maxFloor: 8,
    //   // minFloor: -1,
    //   pressures: {
    //     '8': 100,
    //     '-1': 200,
    //   }
    // }

    this.setState({
      elevatorSettings: elevatorSettings,
    })

    // setTimeout(function(){
    //   self.setState({
    //     elevatorSettings: elevatorSettings,
    //   })
    // },100)

    this.pressureListener = DeviceEventEmitter.addListener('Gyroscope', function (data) {
      self.pressure = Math.round(data.x * 1000) - 1020000;
    });
       
  }

  componentWillUnmount(){
    this.pressureListener.remove();
  }

  // _setNumOfFLoors(){
  //   let elevatorSettings = {
  //     maxFloor: 8,
  //     minFloor: -1,
  //     pressures: {
  //       '8': 100,
  //       '-1': 200,
  //     }
  //   }
    
  //   AsyncStorage.setItem('@ElevatorSettings')

  // }

  _renderFloor(){

    const floorComps = [];

    getRange(-1,8).forEach((floor, i)=>{
      const pressure = this.state.elevatorSettings.pressures[floor];
      floorComps.push(
        <View
          key={i}
          style={{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            marginTop: 8,
          }}
        >
          <Text style={{width: 80}}>{`Floor ${floor}`}</Text>
          <Text style={{width: 80}}>{pressure}</Text>
          <Button
            onPress={()=>{
              var newElevatorSettings = this.state.elevatorSettings;
              newElevatorSettings.pressures[floor] = this.pressure;
              this.setState({
                elevatorSettings: newElevatorSettings,
              })
              setLocalFloorPressure(newElevatorSettings);
            }}
            text={'Set Pressure'}
          />
        </View>      
      )
    })

    return floorComps;

  }

  render() {

    if(this.state.elevatorSettings === undefined){
      return <Text>{'Loading...'}</Text>
    }

    return (
      <ScrollView>

        <Text>
          {'Settings'}
        </Text>

        {/*
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder={'min floor'}
          // onChangeText={(text) => this.setState({text})}
          // value={this.state.text}
        />

        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder={'max floor'}
          // onChangeText={(text) => this.setState({text})}
          // value={this.state.text}
        />


        <Button
          text={'Set Min Max Floor'}
        />
      */}

        <View style={{marginTop:20}}>

          {this._renderFloor.call(this)}

        </View>


      </ScrollView>
    );
  }
}

export default Settings;
