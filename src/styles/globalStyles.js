import { Platform, PlatformColor } from 'react-native';

export const kPrimaryColor = 'crimson';

export const kBackgroundColor = Platform.select({
  ios: () => PlatformColor('systemBackground'),
  android: () => PlatformColor('?android:attr/colorBackground'),
  default: () => 'white'
})();

// deprecated
export const kCellBackgroundColor = Platform.select({
  ios: () => PlatformColor('secondarySystemBackground'),
  android: () => PlatformColor('?android:attr/colorBackgroundFloating'),
  default: () => 'white'
})();

export const kTextColor = Platform.select({
  ios: () => PlatformColor('label'),
  android: () => PlatformColor('?android:attr/colorPrimary'),
  default: () => 'black'
})();
