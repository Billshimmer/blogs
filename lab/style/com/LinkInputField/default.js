import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  touch:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  TextInput:{
    height: 44,
    flex: 1,
    fontSize:15,
    color:Theme.secondaryTextColor,
    textAlign:'right',
  },
  rightIcon:{
    color:Theme.secondaryTextColor,
    fontSize:18,
    paddingLeft:10,
  }
});
