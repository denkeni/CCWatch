import {
  StyleSheet,
  Platform,
  PlatformColor,
} from 'react-native';
import { kBackgroundColor } from './globalStyles.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    backgroundColor: kBackgroundColor
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#E5E5EA'
    // backgroundColor: kCellBackgroundColor
  },
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  date: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8E8E93',
    textAlign: 'left'
  },
  time: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8E8E93',
    textAlign: 'right'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        color: PlatformColor('label'),
      },
      /*
      android: {
        // FIXME: Android dark theme switching does not work;
        // textColorPrimary does not work; default gray is okay.
        // color: PlatformColor('?android:attr/textColorPrimary'),
      },
      */
      default: { color: 'black' }
    })
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C93400',
    marginBottom: 8
  },
  content: {
    fontSize: 18,
    ...Platform.select({
      ios: {
        color: PlatformColor('label'),
      },
      /*
      android: {
        // FIXME: Android dark theme switching does not work;
        // textColorPrimary does not work; default gray is okay.
        // color: PlatformColor('?android:attr/textColorPrimary'),
      },
      */
      default: { color: 'black' }
    })
  }
});

export default styles;
