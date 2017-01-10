
import {
  AsyncStorage,
} from 'react-native';

const getLocalFloorPressure = async function(){
  const elevatorSettingsString = await AsyncStorage.getItem('@ElevatorSettings');
  try {
    const elevatorSettings = JSON.parse(elevatorSettingsString);

    if(elevatorSettings.maxPressure === undefined || 
        elevatorSettings.minPressure === undefined){
      throw new Error('please initialize pressure')
    }

    return elevatorSettings;
  } catch(err) {
    // console.warn('err', err)
    const elevatorSettings = {
      // pressures: {}
      maxPressure: undefined,
      minPressure: undefined,
    }
    await AsyncStorage.setItem('@ElevatorSettings', JSON.stringify(elevatorSettings));
    return elevatorSettings;
  }
}

const setLocalFloorPressure = async function(elevatorSettings){
  AsyncStorage.setItem('@ElevatorSettings', JSON.stringify(elevatorSettings));
}

export {
  getLocalFloorPressure,
  setLocalFloorPressure,
}
