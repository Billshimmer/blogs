import ReactNative, {
  StyleSheet,
  Dimensions,
} from 'react-native';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
  },
  selectView: {
    height: 45,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: Theme.borderColor,
  },
  selectItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: 49,
    backgroundColor: Theme.headerBarBgColor,
  },
  selectItemText: {
    fontSize: 15,
    color: Theme.headerBarFontColorLight,
  },
});
