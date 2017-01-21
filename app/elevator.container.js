import React, { Component } from 'react';

import {
  View,
  Image,
  Animated,
  TouchableOpacity,
  Text,
  Easing,
  DeviceEventEmitter,
  Dimensions,
  NativeModules,
} from 'react-native';

import _ from 'lodash';
import moment from 'moment';
var RNFS = require('react-native-fs');

const gc = NativeModules.GarbageCollector.gc;

const EASING_1 = Easing.bezier(0.65, 0, 1, 1)

// import { SensorManager } from 'NativeModules';

import {
  getLocalFloorPressure,
  setLocalFloorPressure,
} from './Utils';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;
// const IMAGE_HEIGHT = 102710;
// const LAST_TOP = -111610; 
// const LAST_TOP = -102710;  //bottom 
const LAST_TOP = -102300;  //bottom
// const DURATION = 20000; //from bottom floor to top floor 
const DURATION = 24000; //from bottom floor to top floor 
const NUM_AVR_ACC = 6; //number of moving average of acceleration values
const MIN_SCROLL_DURATION = 4000;
const BUFFER_DISTANCE = 3500 ;
const BUFFER_DURATION = 1800;
const SECOND_MIN_MAX_EXTRA = 100;

// const DEBUG_MODE = true;
const DEBUG_MODE = false;


var round = function(x){
  return Math.round(x * 1000) / 1000
}

var getAverage = function(arr, n){
  var sum=0;
  if(n>arr.length){
    n = arr.length;
  }
  for(var ii=arr.length-n; ii<arr.length; ii++){
    sum += arr[ii];
  }
  return sum/n;
}

var calcPercentage = function(value, min, max){
  return ((value-min) / (max-min));
}

class Elevator extends Component {

  constructor(props) {
    super(props);

    this.direction = undefined;
    this.temperature = undefined;
    this.temperatures = [];
    this.pressure = undefined;
    this.pressures = [];
    this.acceleration = undefined;
    this.accelerations = [];
    this.listen = true;

    this.logData = [];

    this.state = {
      direction: 'STOP',
      showBottom: true,
      // top: new Animated.Value(0),
      top: new Animated.Value(LAST_TOP), // initial position at bottom 
    };
  }

  _startSensors() {
    const self = this;
    this.temperatureListener = DeviceEventEmitter.addListener('Thermometer', function (data) {
      console.warn('data.temp', data.temp)
      self.temperature = data.temp;
    });

    // pressure
    this.pressureListener = DeviceEventEmitter.addListener('Gyroscope', function (data) {
      self.pressure = Math.round(data.x * 1000) - 1020000;
    });

    this.accelerationListener = DeviceEventEmitter.addListener('Accelerometer', function (data) {
      self.acceleration = Math.round(data.y * 1000);
      // self.accelerations.push(self.acceleration)
      // self.accelerations.slice(self.accelerations.length-10, self.accelerations.length)
    });
  }

  async logSensorData(ii){

    this.logData.push({
      p: this.pressure,
      t: this.temperature,
      a: this.acceleration,
    })


    if(ii % 600 == 0){
      const day = moment(new Date()).format('YYYYMMDD');
      const minute = moment(new Date()).format('hhmm');

      const directory = RNFS.ExternalDirectoryPath + './' + day;
      const fileExists = await RNFS.exists(directory)
      if(!fileExists){
        await RNFS.mkdir(directory)
      }

      const filePath = directory + '/' + minute + '.json'; 
      await RNFS.writeFile(filePath, JSON.stringify(this.logData));
      this.logData = [];
    }

  }

  async componentDidMount() {
    const self = this;

    this.elevatorSettings = await getLocalFloorPressure();
  
    if(DEBUG_MODE){
      this.minPressure = 550;
      this.secondMinPressure = 750;
      this.maxPressure = 2500;
      this.secondMaxPressure = 2300

    } else {
      this.minPressure = this.elevatorSettings.minPressure;
      this.secondMinPressure = this.elevatorSettings.secondMinPressure;
      this.maxPressure = this.elevatorSettings.maxPressure;
      this.secondMaxPressure = this.elevatorSettings.secondMaxPressure;
    }


    let state = 0;
    let i = 0;
    let ii = 0

    if(DEBUG_MODE){
      var datas = [{p:1023038,a:7674},{p:1022768,a:8296},{p:1022768,a:8138},{p:1022788,a:8308},{p:1022788,a:8340},{p:1022778,a:8213},{p:1022778,a:8364},{p:1022768,a:8277},{p:1022778,a:8368},{p:1022768,a:8436},{p:1022798,a:8468},{p:1022808,a:8372},{p:1022808,a:8358},{p:1022798,a:8447},{p:1022798,a:8435},{p:1022788,a:8495},{p:1022798,a:8253},{p:1022788,a:8392},{p:1022788,a:8432},{p:1022798,a:8260},{p:1022798,a:7521},{p:1022798,a:7711},{p:1022798,a:7671},{p:1022798,a:7870},{p:1022788,a:8217},{p:1022798,a:8060},{p:1022788,a:7607},{p:1022808,a:7728},{p:1022788,a:7606},{p:1022778,a:7644},{p:1022788,a:7653},{p:1022788,a:7798},{p:1022788,a:7616},{p:1022788,a:7746},{p:1022778,a:7615},{p:1022788,a:7784},{p:1022788,a:7730},{p:1022788,a:7689},{p:1022788,a:7689},{p:1022788,a:7698},{p:1022798,a:7801},{p:1022768,a:7839},{p:1022768,a:8243},{p:1022768,a:8108},{p:1022768,a:7736},{p:1022788,a:7786},{p:1022768,a:7201},{p:1022758,a:7622},{p:1022718,a:8148},{p:1022778,a:8057},{p:1022788,a:7903},{p:1022788,a:7851},{p:1022778,a:7770},{p:1022788,a:8118},{p:1022778,a:8064},{p:1022798,a:8018},{p:1022788,a:8187},{p:1022798,a:8169},{p:1022788,a:7853},{p:1022788,a:8119},{p:1022808,a:8002},{p:1022808,a:8227},{p:1022798,a:8265},{p:1022798,a:8020},{p:1022798,a:8749},{p:1022798,a:9009},{p:1022798,a:9923},{p:1022788,a:9547},{p:1022778,a:9984},{p:1022798,a:8315},{p:1022798,a:9074},{p:1022808,a:8824},{p:1022808,a:9779},{p:1022788,a:8949},{p:1022788,a:9267},{p:1022788,a:9783},{p:1022798,a:9630},{p:1022798,a:9036},{p:1022798,a:9371},{p:1022808,a:9985},{p:1022808,a:9783},{p:1022778,a:9696},{p:1022778,a:9577},{p:1022778,a:9546},{p:1022788,a:9596},{p:1022798,a:9642},{p:1022798,a:9739},{p:1022818,a:9631},{p:1022838,a:9624},{p:1022838,a:9678},{p:1022838,a:9675},{p:1022838,a:9686},{p:1022838,a:9698},{p:1022838,a:9674},{p:1022828,a:9662},{p:1022838,a:9685},{p:1022828,a:9690},{p:1022838,a:9654},{p:1022848,a:9690},{p:1022838,a:9751},{p:1022848,a:9890},{p:1022818,a:9754},{p:1022828,a:9872},{p:1022828,a:9928},{p:1022828,a:9946},{p:1022848,a:10025},{p:1022828,a:10018},{p:1022828,a:10113},{p:1022808,a:10184},{p:1022808,a:10256},{p:1022808,a:10229},{p:1022818,a:10178},{p:1022798,a:10283},{p:1022778,a:10108},{p:1022778,a:10290},{p:1022778,a:10179},{p:1022758,a:10223},{p:1022748,a:10190},{p:1022728,a:10063},{p:1022708,a:9970},{p:1022698,a:9985},{p:1022678,a:9894},{p:1022678,a:9742},{p:1022668,a:9686},{p:1022668,a:9593},{p:1022668,a:9618},{p:1022658,a:9663},{p:1022628,a:9689},{p:1022608,a:9733},{p:1022588,a:9703},{p:1022578,a:9703},{p:1022588,a:9588},{p:1022558,a:9600},{p:1022558,a:9678},{p:1022528,a:9686},{p:1022518,a:9701},{p:1022508,a:9683},{p:1022498,a:9720},{p:1022488,a:9715},{p:1022468,a:9685},{p:1022458,a:9667},{p:1022438,a:9657},{p:1022418,a:9647},{p:1022408,a:9620},{p:1022398,a:9632},{p:1022368,a:9653},{p:1022368,a:9679},{p:1022358,a:9678},{p:1022338,a:9716},{p:1022318,a:9657},{p:1022308,a:9677},{p:1022298,a:9722},{p:1022298,a:9724},{p:1022278,a:9677},{p:1022258,a:9679},{p:1022258,a:9608},{p:1022248,a:9651},{p:1022218,a:9679},{p:1022208,a:9689},{p:1022198,a:9643},{p:1022168,a:9549},{p:1022158,a:9403},{p:1022138,a:9361},{p:1022138,a:9300},{p:1022148,a:9249},{p:1022138,a:9203},{p:1022138,a:9184},{p:1022118,a:9144},{p:1022098,a:9188},{p:1022098,a:9153},{p:1022098,a:9208},{p:1022088,a:9138},{p:1022088,a:9212},{p:1022078,a:9174},{p:1022088,a:9216},{p:1022078,a:9313},{p:1022088,a:9313},{p:1022098,a:9403},{p:1022088,a:9449},{p:1022078,a:9486},{p:1022078,a:9543},{p:1022078,a:9547},{p:1022058,a:9645},{p:1022048,a:9661},{p:1022048,a:9668},{p:1022028,a:9644},{p:1022018,a:9565},{p:1022018,a:9690},{p:1021988,a:9639},{p:1021988,a:9675},{p:1021988,a:9653},{p:1021988,a:9659},{p:1021998,a:9598},{p:1021998,a:9699},{p:1021988,a:9631},{p:1022008,a:9662},{p:1021998,a:9648},{p:1022008,a:9708},{p:1021998,a:9632},{p:1021978,a:9728},{p:1022008,a:9716},{p:1021998,a:9663},{p:1021998,a:9668},{p:1021998,a:9765},{p:1021998,a:9701},{p:1021988,a:9721},{p:1022008,a:9641},{p:1022008,a:9699},{p:1022018,a:9695},{p:1021988,a:9643},{p:1021988,a:9699},{p:1021988,a:9651},{p:1021998,a:9675},{p:1022008,a:9660},{p:1021998,a:9651},{p:1021998,a:9674},{p:1022008,a:9704},{p:1021998,a:9699},{p:1021998,a:9654},{p:1021988,a:9660},{p:1021998,a:9660},{p:1021998,a:9686},{p:1021998,a:9674},{p:1022008,a:9672},{p:1022008,a:9654},{p:1022018,a:9681},{p:1022008,a:9656},{p:1021998,a:9659},{p:1021998,a:9679},{p:1022008,a:9655},{p:1022018,a:9678},{p:1022008,a:9683},{p:1022018,a:9687},{p:1022018,a:9678},{p:1021998,a:9677},{p:1021998,a:9691},{p:1022008,a:9690},{p:1021998,a:9665},{p:1022008,a:9659},{p:1022008,a:9653},{p:1021998,a:9662},{p:1022018,a:9657},{p:1022018,a:9690},{p:1022008,a:9679},{p:1022008,a:9693},{p:1022008,a:9692},{p:1022008,a:9671},{p:1022018,a:9683},{p:1022028,a:9667},{p:1022018,a:9668},{p:1021998,a:9596},{p:1021998,a:9657},{p:1021998,a:9708},{p:1021998,a:9704},{p:1021998,a:9674},{p:1021998,a:9690},{p:1022008,a:9660},{p:1022008,a:9686},{p:1022008,a:9706},{p:1021998,a:9623},{p:1022008,a:9701},{p:1022018,a:9708},{p:1022018,a:9703},{p:1022018,a:9703},{p:1022008,a:9643},{p:1022018,a:9638},{p:1022028,a:9657},{p:1022028,a:9696},{p:1022038,a:9667},{p:1022038,a:9698},{p:1022048,a:9844},{p:1022068,a:9721},{p:1022058,a:9687},{p:1022068,a:9684},{p:1022068,a:9677},{p:1022068,a:9684},{p:1022058,a:9686},{p:1022058,a:9672},{p:1022058,a:9667},{p:1022048,a:9672},{p:1022058,a:9669},{p:1022048,a:9663},{p:1022048,a:9763},{p:1022058,a:9904},{p:1022068,a:9803},{p:1022068,a:9868},{p:1022058,a:9884},{p:1022048,a:10033},{p:1022068,a:9978},{p:1022038,a:10055},{p:1022038,a:10089},{p:1022048,a:10220},{p:1022038,a:10216},{p:1022048,a:10240},{p:1022038,a:10193},{p:1022038,a:10238},{p:1022018,a:10175},{p:1021998,a:10219},{p:1021998,a:10213},{p:1021998,a:10256},{p:1021988,a:10214},{p:1021978,a:10106},{p:1021958,a:10031},{p:1021948,a:9954},{p:1021938,a:9910},{p:1021918,a:9807},{p:1021908,a:9796},{p:1021898,a:9685},{p:1021908,a:9589},{p:1021888,a:9672},{p:1021878,a:9680},{p:1021858,a:9691},{p:1021848,a:9716},{p:1021828,a:9674},{p:1021818,a:9672},{p:1021798,a:9716},{p:1021788,a:9662},{p:1021778,a:9703},{p:1021768,a:9680},{p:1021748,a:9623},{p:1021738,a:9626},{p:1021718,a:9653},{p:1021698,a:9708},{p:1021698,a:9708},{p:1021678,a:9701},{p:1021648,a:9654},{p:1021648,a:9720},{p:1021648,a:9656},{p:1021628,a:9636},{p:1021628,a:9692},{p:1021599,a:9663},{p:1021599,a:9668},{p:1021589,a:9721},{p:1021569,a:9683},{p:1021549,a:9691},{p:1021529,a:9678},{p:1021519,a:9629},{p:1021519,a:9696},{p:1021509,a:9637},{p:1021509,a:9645},{p:1021489,a:9632},{p:1021479,a:9691},{p:1021469,a:9729},{p:1021449,a:9686},{p:1021449,a:9681},{p:1021439,a:9650},{p:1021409,a:9692},{p:1021399,a:9735},{p:1021399,a:9692},{p:1021369,a:9741},{p:1021359,a:9704},{p:1021339,a:9642},{p:1021319,a:9672},{p:1021309,a:9657},{p:1021309,a:9671},{p:1021299,a:9669},{p:1021289,a:9669},{p:1021289,a:9620},{p:1021239,a:9610},{p:1021239,a:9689},{p:1021229,a:9665},{p:1021219,a:9663},{p:1021199,a:9474},{p:1021189,a:9398},{p:1021179,a:9306},{p:1021179,a:9287},{p:1021159,a:9167},{p:1021139,a:9215},{p:1021119,a:9181},{p:1021109,a:9181},{p:1021099,a:9184},{p:1021099,a:9186},{p:1021079,a:9220},{p:1021079,a:9216},{p:1021059,a:9174},{p:1021059,a:9216},{p:1021069,a:9263},{p:1021079,a:9358},{p:1021079,a:9366},{p:1021069,a:9428},{p:1021059,a:9441},{p:1021069,a:9523},{p:1021079,a:9563},{p:1021079,a:9624},{p:1021059,a:9636},{p:1021029,a:9776},{p:1021019,a:9638},{p:1021009,a:9645},{p:1020999,a:9636},{p:1020989,a:9674},{p:1020999,a:9647},{p:1021009,a:9633},{p:1020999,a:9655},{p:1020989,a:9784},{p:1020989,a:9698},{p:1020989,a:9696},{p:1020989,a:9639},{p:1020989,a:9693},{p:1020989,a:9710},{p:1020999,a:9757},{p:1020999,a:9705},{p:1020999,a:9721},{p:1020999,a:9717},{p:1020999,a:9316},{p:1020999,a:9710},{p:1021009,a:9689},{p:1020989,a:9718},{p:1020999,a:9697},{p:1020999,a:9632},{p:1020999,a:9712},{p:1021009,a:9699},{p:1021019,a:9702},{p:1020999,a:9691},{p:1020999,a:9648},{p:1020999,a:9699},{p:1020999,a:9674},{p:1020999,a:9687},{p:1020999,a:9693},{p:1020989,a:9699},{p:1020989,a:9613},{p:1020999,a:9695},{p:1020999,a:9697},{p:1020989,a:9672},{p:1020999,a:9566},{p:1020999,a:9843},{p:1020999,a:9672},{p:1020989,a:9697},{p:1020989,a:9665},{p:1020999,a:9678},{p:1020989,a:9683},{p:1020989,a:9667},{p:1021009,a:9692},{p:1020989,a:9675},{p:1020989,a:9669},{p:1020989,a:9666},{p:1021009,a:9723},{p:1021009,a:9699},{p:1020999,a:9674},{p:1020999,a:9675},{p:1020999,a:9679},{p:1020989,a:9669},{p:1020999,a:9671},{p:1020989,a:9680},{p:1020999,a:9698},{p:1021009,a:9669},{p:1020999,a:9656},{p:1020999,a:9708},{p:1020999,a:9651},{p:1021009,a:9654},{p:1020999,a:9691},{p:1021009,a:9632},{p:1021019,a:9655},{p:1021009,a:9758},{p:1021009,a:9679},{p:1021009,a:9633},{p:1021009,a:9696},{p:1021019,a:9738},{p:1021019,a:9687},{p:1021019,a:9648},{p:1021009,a:9684},{p:1021019,a:9665},{p:1021019,a:9722},{p:1021009,a:9674},{p:1021009,a:9679},{p:1021019,a:9605},{p:1021009,a:9675},{p:1021019,a:9678},{p:1021029,a:9701},{p:1021029,a:9675},{p:1021059,a:9684},{p:1021069,a:9741},{p:1021079,a:9684},{p:1021069,a:9709},{p:1021059,a:9667},{p:1021059,a:9651},{p:1021059,a:9690},{p:1021049,a:9663},{p:1021049,a:9673},{p:1021049,a:9661},{p:1021039,a:9651},{p:1021039,a:9690},{p:1021049,a:9686},{p:1021039,a:9900},{p:1021039,a:9778},{p:1021039,a:9945},{p:1021049,a:9757},{p:1021039,a:9988},{p:1021039,a:9945},{p:1021029,a:10034},{p:1021029,a:10088},{p:1021039,a:10073},{p:1021049,a:10177},{p:1021039,a:10241},{p:1021049,a:10253},{p:1021039,a:10247},{p:1021029,a:10199},{p:1021019,a:10207},{p:1021029,a:10148},{p:1020999,a:10275},{p:1021009,a:10120},{p:1020999,a:10283},{p:1020979,a:10077},{p:1020979,a:10108},{p:1020959,a:9980},{p:1020959,a:9917},{p:1020959,a:9835},{p:1020949,a:9669},{p:1020909,a:9596},{p:1020899,a:9570},{p:1020889,a:9563},{p:1020889,a:9423},{p:1020869,a:9459},{p:1020859,a:9322},{p:1020849,a:9340},{p:1020839,a:9149},{p:1020839,a:9106},{p:1020819,a:9136},{p:1020789,a:9191},{p:1020799,a:9118},{p:1020769,a:9136},{p:1020769,a:9169},{p:1020769,a:9193},{p:1020769,a:9170},{p:1020749,a:9202},{p:1020739,a:9259},{p:1020759,a:9336},{p:1020759,a:9343},{p:1020739,a:9393},{p:1020729,a:9406},{p:1020729,a:9503},{p:1020729,a:9594},{p:1020729,a:9622},{p:1020729,a:9660},{p:1020729,a:9647},{p:1020729,a:9704},{p:1020719,a:9723},{p:1020699,a:9732},{p:1020699,a:9690},{p:1020689,a:9613},{p:1020679,a:9663},{p:1020689,a:9653},{p:1020689,a:9626},{p:1020679,a:9619},{p:1020669,a:9705},{p:1020669,a:9689},{p:1020679,a:9697},{p:1020679,a:9698},{p:1020659,a:9696},{p:1020659,a:9671},{p:1020669,a:9714},{p:1020669,a:9649},{p:1020669,a:9730},{p:1020669,a:9679},{p:1020659,a:9689},{p:1020659,a:9697},{p:1020669,a:9785},{p:1020659,a:9765},{p:1020659,a:9689},{p:1020659,a:9689},{p:1020669,a:9697},{p:1020659,a:9703},{p:1020659,a:9680},{p:1020659,a:9680},{p:1020649,a:9671},{p:1020649,a:9684},{p:1020649,a:9696},{p:1020639,a:9689},{p:1020659,a:9696},{p:1020649,a:9673},{p:1020649,a:9668},{p:1020659,a:9684},{p:1020649,a:9669},{p:1020649,a:9661},{p:1020649,a:9681},{p:1020659,a:9674},{p:1020659,a:9669},{p:1020659,a:9665},{p:1020629,a:9675},{p:1020639,a:9706},{p:1020639,a:9709},{p:1020649,a:9701},{p:1020649,a:9712},{p:1020659,a:9663},{p:1020649,a:9677},{p:1020659,a:9674},{p:1020669,a:9666},{p:1020669,a:9711},{p:1020659,a:9695},{p:1020659,a:9675},{p:1020669,a:9677},{p:1020659,a:9686},{p:1020659,a:9698},{p:1020649,a:9671},{p:1020649,a:9704},{p:1020649,a:9696},{p:1020649,a:9680},{p:1020659,a:9690},{p:1020649,a:9624},{p:1020649,a:9718},{p:1020649,a:9662},{p:1020679,a:9614},{p:1020649,a:9715},{p:1020659,a:9699},{p:1020659,a:9672},{p:1020649,a:9662},{p:1020669,a:9685},{p:1020669,a:9696},{p:1020669,a:9706},{p:1020659,a:9680},{p:1020679,a:9645},{p:1020669,a:9635},{p:1020669,a:9607},{p:1020679,a:9687},{p:1020669,a:9753},{p:1020669,a:9691},{p:1020669,a:9668},{p:1020669,a:9697},{p:1020679,a:9702},{p:1020699,a:9675},{p:1020719,a:9606},{p:1020719,a:9697},{p:1020719,a:9706},{p:1020719,a:9689},{p:1020729,a:9681},{p:1020729,a:9685},{p:1020729,a:9678},{p:1020719,a:9677},{p:1020719,a:9692},{p:1020719,a:9701},{p:1020719,a:9691},{p:1020689,a:9697},{p:1020689,a:9748},{p:1020689,a:9922},{p:1020689,a:9848},{p:1020689,a:9913},{p:1020689,a:9955},{p:1020699,a:10038},{p:1020699,a:10034},{p:1020699,a:10108},{p:1020699,a:10136},{p:1020699,a:10253},{p:1020699,a:10251},{p:1020699,a:10228},{p:1020689,a:10238},{p:1020669,a:10211},{p:1020669,a:10236},{p:1020669,a:10191},{p:1020639,a:10225},{p:1020659,a:10185},{p:1020649,a:10216},{p:1020639,a:9995},{p:1020629,a:9970},{p:1020629,a:9874},{p:1020609,a:9842},{p:1020599,a:9635},{p:1020589,a:9695},{p:1020579,a:9655},{p:1020579,a:9635},{p:1020569,a:9576},{p:1020539,a:9501},{p:1020519,a:9331},{p:1020509,a:9300},{p:1020479,a:9258},{p:1020479,a:9191},{p:1020469,a:9172},{p:1020459,a:9165},{p:1020449,a:9233},{p:1020429,a:9157},{p:1020429,a:9216},{p:1020429,a:9136},{p:1020419,a:9188},{p:1020419,a:9191},{p:1020409,a:9299},{p:1020409,a:9281},{p:1020399,a:9371},{p:1020399,a:9392},{p:1020399,a:9438},{p:1020409,a:9454},{p:1020409,a:9549},{p:1020409,a:9565},{p:1020399,a:9687},{p:1020409,a:9684},{p:1020409,a:9684},{p:1020399,a:9734},{p:1020369,a:9661},{p:1020359,a:9662},{p:1020339,a:9662},{p:1020349,a:9642},{p:1020339,a:9681},{p:1020319,a:9644},{p:1020319,a:9639},{p:1020319,a:9610},{p:1020319,a:9610},{p:1020319,a:9720},{p:1020329,a:9685},{p:1020319,a:9748},{p:1020329,a:9667},{p:1020319,a:9681},{p:1020319,a:9648},{p:1020309,a:9689},{p:1020319,a:9740},{p:1020319,a:9706},{p:1020319,a:9733},{p:1020319,a:9852},{p:1020319,a:9910},{p:1020319,a:9613},{p:1020309,a:9662},{p:1020309,a:9648},{p:1020319,a:9714},{p:1020329,a:9659},{p:1020329,a:9717},{p:1020329,a:9681},{p:1020329,a:9695},{p:1020339,a:9668},{p:1020319,a:9681},{p:1020319,a:9685},{p:1020329,a:9690},{p:1020329,a:9693},{p:1020319,a:9685},{p:1020329,a:9692},{p:1020319,a:9680},{p:1020299,a:9669},{p:1020309,a:9681},{p:1020319,a:9669},{p:1020319,a:9703},{p:1020319,a:9663},{p:1020329,a:9663},{p:1020339,a:9679},{p:1020339,a:9677},{p:1020339,a:9673},{p:1020329,a:9675},{p:1020319,a:9691},{p:1020319,a:9706},{p:1020329,a:9668},{p:1020329,a:9672},{p:1020329,a:9698},{p:1020329,a:9685},{p:1020329,a:9710},{p:1020339,a:9677},{p:1020319,a:9683},{p:1020339,a:9704},{p:1020339,a:9678},{p:1020329,a:9678},{p:1020329,a:9656},{p:1020329,a:9714},{p:1020329,a:9763},{p:1020329,a:9486},{p:1020329,a:9692},{p:1020329,a:9718},{p:1020319,a:9680},{p:1020329,a:9698},{p:1020329,a:9715},{p:1020329,a:9632},{p:1020349,a:9675},{p:1020349,a:9746},{p:1020339,a:9648},{p:1020349,a:9684},{p:1020339,a:9665},{p:1020339,a:9717},{p:1020339,a:9752},{p:1020359,a:9653},{p:1020339,a:9681},{p:1020349,a:9686},{p:1020349,a:9693},{p:1020359,a:9671},{p:1020369,a:9709},{p:1020379,a:9681},{p:1020399,a:9684},{p:1020419,a:9742},{p:1020399,a:9651},{p:1020399,a:9708},{p:1020409,a:9696},{p:1020409,a:9712},{p:1020399,a:9711},{p:1020409,a:9687},{p:1020399,a:9693},{p:1020399,a:9628},{p:1020399,a:9529},{p:1020409,a:9553},{p:1020419,a:9528},{p:1020419,a:9543},{p:1020419,a:9565},{p:1020419,a:9456},{p:1020429,a:9459},{p:1020409,a:9370},{p:1020409,a:9352},{p:1020409,a:9316},{p:1020409,a:9218},{p:1020399,a:9215},{p:1020409,a:9252},{p:1020419,a:9187},{p:1020419,a:9180},{p:1020419,a:9170},{p:1020439,a:9186},{p:1020439,a:9220},{p:1020449,a:9185},{p:1020469,a:9222},{p:1020469,a:9230},{p:1020479,a:9354},{p:1020479,a:9441},{p:1020479,a:9511},{p:1020499,a:9635},{p:1020509,a:9618},{p:1020529,a:9695},{p:1020539,a:9734},{p:1020549,a:9653},{p:1020549,a:9735},{p:1020589,a:9648},{p:1020599,a:9693},{p:1020609,a:9698},{p:1020609,a:9672},{p:1020609,a:9732},{p:1020629,a:9683},{p:1020639,a:9683},{p:1020639,a:9687},{p:1020659,a:9715},{p:1020669,a:9733},{p:1020689,a:9622},{p:1020689,a:9738},{p:1020719,a:9641},{p:1020739,a:9669},{p:1020749,a:9675},{p:1020759,a:9695},{p:1020779,a:9706},{p:1020809,a:9698},{p:1020829,a:9662},{p:1020829,a:9697},{p:1020849,a:9674},{p:1020849,a:9730},{p:1020869,a:9697},{p:1020889,a:9623},{p:1020909,a:9759},{p:1020929,a:9633},{p:1020929,a:9705},{p:1020939,a:9659},{p:1020959,a:9669},{p:1020959,a:9657},{p:1020959,a:9674},{p:1020979,a:9721},{p:1020989,a:9684},{p:1021009,a:9671},{p:1021019,a:9668},{p:1021029,a:9686},{p:1021049,a:9630},{p:1021069,a:9752},{p:1021089,a:9685},{p:1021099,a:9732},{p:1021099,a:9606},{p:1021109,a:9708},{p:1021129,a:9692},{p:1021159,a:9675},{p:1021169,a:9724},{p:1021169,a:9693},{p:1021179,a:9714},{p:1021199,a:9687},{p:1021239,a:9672},{p:1021229,a:9687},{p:1021239,a:9718},{p:1021249,a:9705},{p:1021269,a:9672},{p:1021269,a:9684},{p:1021279,a:9745},{p:1021289,a:9696},{p:1021299,a:9691},{p:1021329,a:9690},{p:1021349,a:9706},{p:1021349,a:9637},{p:1021359,a:9669},{p:1021379,a:9663},{p:1021389,a:9671},{p:1021399,a:9667},{p:1021409,a:9687},{p:1021419,a:9702},{p:1021439,a:9701},{p:1021469,a:9706},{p:1021479,a:9683},{p:1021499,a:9722},{p:1021499,a:9685},{p:1021519,a:9678},{p:1021529,a:9683},{p:1021549,a:9696},{p:1021559,a:9746},{p:1021578,a:9661},{p:1021578,a:9680},{p:1021578,a:9726},{p:1021599,a:9674},{p:1021609,a:9715},{p:1021648,a:9686},{p:1021648,a:9660},{p:1021668,a:9691},{p:1021658,a:9715},{p:1021678,a:9653},{p:1021678,a:9687},{p:1021698,a:9697},{p:1021728,a:9681},{p:1021728,a:9712},{p:1021748,a:9716},{p:1021758,a:9691},{p:1021778,a:9715},{p:1021808,a:9709},{p:1021828,a:9690},{p:1021828,a:9711},{p:1021848,a:9706},{p:1021868,a:9690},{p:1021878,a:9665},{p:1021888,a:9679},{p:1021908,a:9698},{p:1021928,a:9667},{p:1021938,a:9716},{p:1021948,a:9601},{p:1021958,a:9675},{p:1021968,a:9649},{p:1021988,a:9702},{p:1021998,a:9701},{p:1022018,a:9734},{p:1022048,a:9681},{p:1022058,a:9678},{p:1022068,a:9654},{p:1022078,a:9686},{p:1022068,a:9708},{p:1022078,a:9657},{p:1022088,a:9762},{p:1022108,a:9730},{p:1022128,a:9759},{p:1022138,a:9734},{p:1022148,a:9706},{p:1022158,a:9709},{p:1022168,a:9752},{p:1022168,a:9672},{p:1022198,a:9708},{p:1022208,a:9637},{p:1022218,a:9689},{p:1022228,a:9705},{p:1022238,a:9706},{p:1022258,a:9685},{p:1022258,a:9704},{p:1022278,a:9735},{p:1022278,a:9663},{p:1022288,a:9771},{p:1022308,a:9677},{p:1022318,a:9752},{p:1022348,a:9894},{p:1022348,a:9527},{p:1022368,a:9693},{p:1022368,a:9660},{p:1022388,a:9606},{p:1022408,a:9572},{p:1022428,a:9724},{p:1022428,a:9678},{p:1022428,a:9687},{p:1022448,a:9653},{p:1022448,a:9689},{p:1022468,a:9656},{p:1022468,a:9744},{p:1022488,a:9732},{p:1022508,a:9663},{p:1022518,a:9701},{p:1022508,a:9746},{p:1022558,a:9696},{p:1022558,a:9678},{p:1022588,a:9686},{p:1022608,a:9715},{p:1022608,a:9712},{p:1022608,a:9726},{p:1022628,a:9717},{p:1022638,a:9706},{p:1022658,a:9746},{p:1022668,a:9818},{p:1022678,a:9830},{p:1022688,a:9966},{p:1022698,a:10047},{p:1022718,a:10126},{p:1022718,a:10195},{p:1022748,a:10213},{p:1022758,a:10226},{p:1022768,a:10220},{p:1022778,a:10209},{p:1022768,a:10228},{p:1022778,a:10223},{p:1022798,a:10221},{p:1022808,a:10193},{p:1022818,a:10178},{p:1022818,a:10166},{p:1022808,a:10064},{p:1022808,a:9963},{p:1022828,a:9985},{p:1022818,a:9892},{p:1022828,a:9876},{p:1022818,a:9832},{p:1022828,a:9783},{p:1022818,a:9693},{p:1022828,a:9639},{p:1022828,a:9695},{p:1022828,a:9672},{p:1022808,a:9777},{p:1022808,a:9641},{p:1022788,a:9714},{p:1022778,a:9796},{p:1022778,a:9736},{p:1022768,a:9795},{p:1022768,a:9711},{p:1022768,a:9726},{p:1022768,a:9746},{p:1022758,a:9666},{p:1022768,a:9657},{p:1022758,a:9657},{p:1022758,a:9695},{p:1022768,a:9667},{p:1022768,a:9827},{p:1022768,a:9672},{p:1022768,a:9657},{p:1022768,a:9763},{p:1022768,a:9686},{p:1022768,a:9830},{p:1022788,a:9884},{p:1022778,a:9797},{p:1022778,a:9702},{p:1022778,a:9649},{p:1022788,a:9710},{p:1022778,a:9696},{p:1022778,a:9686},{p:1022778,a:9679},{p:1022758,a:9704},{p:1022768,a:9699},{p:1022768,a:9674},{p:1022778,a:9845},{p:1022768,a:9680},{p:1022788,a:9717},{p:1022778,a:9657},{p:1022768,a:9937},{p:1022758,a:9704},{p:1022758,a:9623},{p:1022778,a:9754},{p:1022768,a:9706},{p:1022758,a:9711},{p:1022768,a:9739},{p:1022758,a:9650},{p:1022748,a:9762},{p:1022768,a:9673},{p:1022758,a:9680},{p:1022758,a:9667},{p:1022768,a:9650},{p:1022788,a:9812},{p:1022788,a:9663},{p:1022788,a:9684},{p:1022788,a:9747},{p:1022788,a:9691},{p:1022778,a:9663},{p:1022778,a:9733},{p:1022778,a:9706},{p:1022768,a:9720},{p:1022778,a:9698},{p:1022788,a:9653},{p:1022778,a:9899},{p:1022788,a:9533},{p:1022788,a:9736},{p:1022788,a:9695},{p:1022788,a:9689},{p:1022768,a:9712},{p:1022758,a:9797},{p:1022758,a:9745},{p:1022768,a:9776},{p:1022778,a:9602},{p:1022768,a:9763},{p:1022778,a:9775},{p:1022778,a:9648},{p:1022778,a:9817},{p:1022778,a:9687},{p:1022768,a:9729},{p:1022778,a:9677},{p:1022798,a:9741},{p:1022798,a:9635},{p:1022818,a:9638},{p:1022808,a:9762},{p:1022818,a:9680},{p:1022818,a:9690},{p:1022808,a:9618},{p:1022798,a:9721},{p:1022818,a:9773},{p:1022828,a:9656},{p:1022838,a:9718},{p:1022818,a:9728},{p:1022818,a:9686},{p:1022828,a:9668},{p:1022828,a:9692},{p:1022828,a:9695},{p:1022838,a:9701},{p:1022818,a:9611},{p:1022818,a:9557},{p:1022828,a:9689},{p:1022838,a:9533},{p:1022838,a:9594},{p:1022838,a:9616},{p:1022828,a:9623},{p:1022838,a:9555},{p:1022808,a:9476},{p:1022828,a:9419},{p:1022818,a:9401},{p:1022818,a:9344},{p:1022818,a:9248}];
      datas = datas.slice(80);//begin from b1

    } else {
      this._startSensors.call(this)
    }



    this.interval = setInterval(function(){
      // return;
      ii++;
      self.logSensorData.call(self, ii);

      if(DEBUG_MODE){
        var data = datas[i];
        if(data === undefined){
          i = 0
          state = 0
          // console.warn('no more accelerations, please refresh page');
          // clearInterval(self.interval)
          return;
        };
        i++;

        self.pressure = data.p - 1020000;
        self.acceleration = data.a;
      }


      self.accelerations.push(self.acceleration)
      self.accelerations = self.accelerations.slice(self.accelerations.length-NUM_AVR_ACC, self.accelerations.length)

      // console.warn(self.accelerations)
      var acceleration = getAverage(self.accelerations, NUM_AVR_ACC);
      // self.acceleration = acceleration;
      // console.warn(acceleration)
      // var acceleration = data.a;

      // const scrollPercentage = calcPercentage(self.state.top._value, 0, LAST_TOP)
      // if(scrollPercentage > 0.5 && self.state.showBottom === false){
      //   self.setState({
      //     showBottom: true,
      //   })
      // }

      // if(scrollPercentage < 0.5 && self.state.showBottom === true){
      //   self.setState({
      //     showBottom: false,
      //   })
      // }

      if(self.listen == false){
        return;
      }

      if(acceleration > 10100){
        if(state == 1){
          return;
        }
        state++;
        self.listen = false; 
        setTimeout(function(){
          self.listen = true;
        },2000)

      }else if(acceleration < 9300){
        if(state == -1){
          return;
        }
        state--;
        self.listen = false; 
        setTimeout(function(){
          self.listen = true;
        },2000)

      }else{
        return;
      }

      // const floorNum = getFloorNum(self.pressure);

      if(state === 1){
        // console.log("up");
        self.scrollUp();
      } else if(state === 0){
        // console.log("stop");
        self.stop();
      } else if(state === -1){
        // console.log("down");
        self.scrollDown();
      }

    },100)


    // test use
    // setTimeout(function(){
    //   Animated.timing(
    //      self.state.top,
    //      {toValue: LAST_TOP + 10000,
    //      duration: 5000,
    //      easing:Easing.in(EASING_1)}
    //   ).start();      
    // },1000)
       
  }

  componentWillUnmount() {
    this.temperatureListener && this.temperatureListener.remove();
    this.pressureListener && this.pressureListener.remove();
    this.accelerationListener && this.accelerationListener.remove();
    clearInterval(this.interval);
  }


  scrollUp() {

    this.direction = 'UP';

    const pressurePercentage = calcPercentage(this.pressure, this.minPressure, this.maxPressure);

    // console.warn(this.pressure, this.minPressure, this.maxPressure, percentage)
    // console.warn('UP', this.pressure, percentage, DURATION * Math.abs(percentage))

    const scrollPercentage = calcPercentage(this.state.top._value, 0, LAST_TOP)

    console.warn('UP', round(pressurePercentage), round(scrollPercentage))

    const percentage = (pressurePercentage + scrollPercentage) / 2


    Animated.timing(
       this.state.top,
       {toValue: 0,
       duration: Math.max(DURATION * Math.abs(pressurePercentage), MIN_SCROLL_DURATION),
       easing:Easing.inOut(EASING_1)}
     ).start();

  }

  scrollDown() {

    this.direction = 'DOWN';

    const pressurePercentage = calcPercentage(this.pressure, this.minPressure, this.maxPressure);
    const scrollPercentage = calcPercentage(this.state.top._value, 0, LAST_TOP)

    console.warn('DOWN', round(pressurePercentage), round(scrollPercentage))
    // console.warn('DOWN', this.pressure, percentage, DURATION * Math.abs(1 - percentage))
    // console.warn(percentage)
    const percentage = (pressurePercentage + scrollPercentage) / 2

    Animated.timing(
       this.state.top,
       {toValue: LAST_TOP,
       duration: Math.max(DURATION * Math.abs(1 - pressurePercentage), MIN_SCROLL_DURATION),
       easing:Easing.inOut(EASING_1)}
     ).start();
  }

  stop() {

    this.state.top.stopAnimation();

    let currentTop = this.state.top._value;

    const pressurePercentage = calcPercentage(this.pressure, this.minPressure, this.maxPressure);

    const scrollPercentage = calcPercentage(this.state.top._value, 0, LAST_TOP)

    const percentage = (pressurePercentage + scrollPercentage) / 2
    // console.warn('STOP', 'pressurePercentage: ' + pressurePercentage, 'scrollPercentage:' + scrollPercentage)

    console.warn('STOP\n', JSON.stringify({
      pressureP: round(pressurePercentage),
      scrollP: round(scrollPercentage),
      pressure: this.pressure,
    }))

    // console.warn('stop', this.pressure, pressurePercentage)

    // garbage collector
    setTimeout(function(){
      gc();
    }, BUFFER_DURATION + 1000)

    if(this.direction == 'DOWN'){

      var targetTop = currentTop - BUFFER_DISTANCE
      // if(this.pressure > (this.maxPressure-250)){
      if(this.pressure > (this.secondMaxPressure + SECOND_MIN_MAX_EXTRA)){
        console.warn('floorNum == 0')
        targetTop = LAST_TOP;
      }

      Animated.timing(
         this.state.top,
         {toValue: Math.max(targetTop, LAST_TOP),
         duration: BUFFER_DURATION,
         easing:Easing.out(EASING_1)}
      ).start();

    }

    if(this.direction == 'UP'){

      var targetTop = currentTop + BUFFER_DISTANCE
      // if(floorNum == 8){
      // if(percentage < 0){
      // if(this.pressure < (this.minPressure+250)){ //todo: add second top /bottom floor pressure setting 
      if(this.pressure < (this.secondMinPressure - SECOND_MIN_MAX_EXTRA)){
        console.warn('floorNum == 8')
        targetTop = 0;
      }

      Animated.timing(
         this.state.top,
         {toValue: Math.min(targetTop, 0),
         duration: BUFFER_DURATION,
         easing:Easing.out(EASING_1)}
       ).start();      
    }

    this.direction = undefined;

  }


  _renderImages(){
    const self = this;
    var imageNames = [
      'img1_0','img1_1','img1_2','img1_3','img1_4','img1_5','img1_6','img1_7','img1_8','img1_9','img1_10','img1_11','img1_12','img1_13','img1_14','img1_15','img1_16','img1_17','img1_18','img1_19','img1_20','img1_21','img1_22','img1_23','img1_24','img1_25','img1_26','img1_27','img1_28','img1_29','img1_30','img1_31',
      'img2_0','img2_1','img2_2','img2_3','img2_4','img2_5','img2_6','img2_7','img2_8','img2_9','img2_10','img2_11','img2_12','img2_13','img2_14','img2_15','img2_16','img2_17','img2_18','img2_19','img2_20','img2_21','img2_22','img2_23','img2_24','img2_25','img2_26','img2_27','img2_28','img2_29','img2_30','img2_31',
      'img3_0','img3_1','img3_2','img3_3','img3_4','img3_5','img3_6','img3_7','img3_8','img3_9','img3_10','img3_11','img3_12','img3_13','img3_14','img3_15','img3_16','img3_17','img3_18','img3_19','img3_20','img3_21','img3_22','img3_23','img3_24','img3_25','img3_26','img3_27','img3_28','img3_29','img3_30','img3_31',
      'img4_0','img4_1','img4_2','img4_3','img4_4','img4_5','img4_6','img4_7','img4_8','img4_9','img4_10','img4_11','img4_12','img4_13','img4_14','img4_15','img4_16','img4_17','img4_18','img4_19',/*'img4_20','img4_21','img4_22','img4_23','img4_24','img4_25','img4_26','img4_27','img4_28','img4_29','img4_30','img4_31'*/];
    var imgRatio = 983/380;
    var height = 0;
    const imagesComp = [];
    imageNames.forEach((imageName, i)=>{
      if(imageName.substring(0,4) === 'img4'){
        imgRatio = 711/380;
      } else {
        imgRatio = 983/380;
      }

      // if(self.state.showBottom === true){
      //   // if(i < 50){
      //   if(i < 45){
      //     imageName = 'none'
      //   }
      // } else {
      //   // if(i > 70){
      //   if(i > 65){
      //     imageName = 'none'
      //   }
      // }

      // if(self.state.showBottom === true){
      //   // if(i < 50){
      //   if(i < 50){
      //     imageName = 'none'
      //   }
      // } else {
      //   // if(i > 70){
      //   if(i > 60){
      //     imageName = 'none'
      //   }
      // }

      imagesComp.push(
        <Image
          key={i}
          style={{width: (DEVICE_WIDTH), height: (DEVICE_WIDTH)*imgRatio-1}} // -1 to prevent while horizontal line
          source={{uri:imageName}}
        />
      )
    })
    return imagesComp
  }

  render() {
    return (
      <View>

        <Animated.View
          ref={(myView)=>{this.myView=myView}}
          style={{
            position: 'absolute',
            top: this.state.top,
            left:0,
          }}
        >

          { this._renderImages.call(this) }

        </Animated.View>

        {
        // <TouchableOpacity
        //   onPress={this.scrollUp.bind(this)}
        //   style={{
        //     position: 'absolute',
        //     top: 20,
        //     left:20,
        //     width: 200,
        //     height: 20,
        //     // backgroundColor: this.state.direction === 'UP' ? 'red' : '#ccc',
        //   }}
        // >
        //   <Text>{'UP'}</Text>
        // </TouchableOpacity>

        // <TouchableOpacity
        //   onPress={this.stop.bind(this)}
        //   style={{
        //     position: 'absolute',
        //     top: 50,
        //     left:20,
        //     width: 200,
        //     height: 20,
        //     // backgroundColor: this.state.direction === 'STOP' ? 'red' : '#ccc',
        //   }}
        // >
        //   <Text>{'Stop'}</Text>
        // </TouchableOpacity>

        // <TouchableOpacity
        //   onPress={this.scrollDown.bind(this)}
        //   style={{
        //     position: 'absolute',
        //     top: 80,
        //     left:20,
        //     width: 200,
        //     height: 20,
        //     // backgroundColor: this.state.direction === 'DOWN' ? 'red' : '#ccc',
        //   }}
        // >
        //   <Text>{'DOWN'}</Text>
        // </TouchableOpacity>
        }


      </View>
    );
  }
}

export default Elevator;
