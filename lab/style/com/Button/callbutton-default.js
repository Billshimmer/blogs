import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.primaryColor,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Theme.primaryColor,
    fontSize: 13,
  },
  buttonActive: {
    backgroundColor: Theme.primaryColor,
  },
  textActive: {
    color: '#FFFFFF',
  },
});
