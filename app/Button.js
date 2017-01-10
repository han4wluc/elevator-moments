
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          height: 40,
          backgroundColor: '#ccc',
          ...this.props.style,
        }}
      >
        <Text>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

export default Button;