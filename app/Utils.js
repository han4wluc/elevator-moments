
import {
  AsyncStorage,
} from 'react-native';

const getLocalFloorPressure = async function(){
  const elevatorSettingsString = await AsyncStorage.getItem('@ElevatorSettings');
  try {
    const elevatorSettings = JSON.parse(elevatorSettingsString);

    if(!elevatorSettings.pressure){
      throw new Error('please initialize pressure')
    }

    return elevatorSettings;
  } catch(err) {
    const elevatorSettings = {
      pressures: {}
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
