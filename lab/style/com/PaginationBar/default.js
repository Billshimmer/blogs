import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  container: {
    backgroundColor:'white',
  },
  item: {
    marginLeft: 5,
    marginRight: 5,
    height: 7,
    width: 7,
    borderRadius: 3.5,
    backgroundColor: Theme.borderColorLight,
  },
  activeColor: {
    backgroundColor: Theme.primaryColor,
  },
});
