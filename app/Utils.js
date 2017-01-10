
import {
  AsyncStorage,
} from 'react-native';

const getLocalFloorPressure = async function(){
  const elevatorSettingsString = await AsyncStorage.getItem('@ElevatorSettings');
  try {
    const elevatorSettings = JSON.parse(elevatorSettingsString);
    return elevatorSettings;
  } catch(err) {
    return {
      pressures: {}
    }
  }
}

const setLocalFloorPressure = async function(elevatorSettings){
  AsyncStorage.setItem('@ElevatorSettings', JSON.stringify(elevatorSettings));
}

export {
  getLocalFloorPressure,
  setLocalFloorPressure,
}
