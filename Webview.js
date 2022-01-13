import React, { useEffect } from 'react';
import { Share, Platform } from 'react-native';
import { Navigation } from "react-native-navigation";
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

// See: https://github.com/wix/react-native-navigation/issues/5409
async function prepareShareIcon() {
  const name = Platform.OS === 'ios' ? 'share-outline' : 'share-social-outline';
  const image = await Ionicons.getImageSource(iconID, 25);
  return image;
};

export const WebScreen = (props) => {
  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'share',
            text: '分享',
            // TODO: icon
          },
        ],
      },
    });
  }, []);

  const navigationButtonEventListener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
    Share.share({
      message: Platform.OS === 'android' ? props.videoUrl : null,
      url: props.videoUrl
    });
  });

  return (
    <WebView source={{ uri: props.videoUrl }}
             decelerationRate={0.998} />
  );
};