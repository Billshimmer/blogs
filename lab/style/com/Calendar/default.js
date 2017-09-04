import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  calendarContainer: {
    backgroundColor: 'pink',
  },
  selectedDayCircle: {
    backgroundColor: 'pink',
    borderColor: 'red',
    borderWidth: 1,
    overflow:'hidden'
  },
  title: {
    // flex: 0,
    color: 'white',
  },
  calendarControls: {
    // justifyContent: 'center',
  },
  controlButton: {
  },
  controlButtonText: {
    color: 'white',
  },
  dayHeading: {
    color: 'white',
  },
  weekendHeading: {
    color: 'white',
  },
  day: {
    color: 'white',
  },
  weekendDayText: {
    color: 'white',
  },
  currentDayCircle: {

  },
  calendarHeading: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  //可能影响到布局的参数
  dayButton: {
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
});
