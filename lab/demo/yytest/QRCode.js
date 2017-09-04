import React, {
  
  Component,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  PropTypes,
  Modal,
} from 'react-native';

import {
  Page,
} from 'lab4';

import QRCode from 'react-native-qrcode';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class QRcode extends SimplePage{
  constructor(props, context) {
    super(props, context);
    this.state = {
      text:'',
      textOut:'',
      show:false,
    }
    this.onPress=this.onPress.bind(this);
  }
  renderContent(){
    return(
      <View style={styles.container}>
        <View style={{flexDirection:'row'}}>
          <TextInput
            style={{height: 40,width:200,borderColor: 'gray', borderWidth: 1,}}
            onChangeText={(text) => this.setState({text:text})}
            keyboardType="default"
            value={this.state.text}
            clearButtonMode="while-editing"
          />
          <TouchableOpacity onPress={this.onPress}>
            <View style={{height:40,width:40,backgroundColor:'red'}}/>
          </TouchableOpacity>
        </View>
        <Modal visible={this.state.show} animated={true}>
          <View style={styles.QRContainer}>
            <TouchableOpacity onPress={()=>{this.setState({show:false})}}>
              <QRCode
                value={this.state.textOut}
                size={150}
                bgColor='purple'
                fgColor='white'/>
            </TouchableOpacity>

          </View>
        </Modal>

      </View>
    );
  }

  onPress(){
    this.setState({textOut:this.state.text,show:true});
  }

}

var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center'
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 10,
      borderRadius: 5,
      padding: 5,
    },
    QRContainer:{
      flex:1,
      backgroundColor:'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
