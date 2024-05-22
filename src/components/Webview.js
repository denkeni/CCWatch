import React, { useEffect } from 'react';
import { Linking, Share, Platform } from 'react-native';
import { Navigation } from "react-native-navigation";
import { WebView } from 'react-native-webview';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Ionicons from 'react-native-vector-icons/Ionicons';

// See: https://github.com/wix/react-native-navigation/issues/5409
async function prepareShareIcon() {
  const name = Platform.OS === 'ios' ? 'share-outline' : 'share-social-outline';
  const image = await Ionicons.getImageSource(iconID, 25);
  return image;
};

const WebScreen = (props) => {
  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: props.videoUrl,
            text: '分享',
            // TODO: icon
          },
          {
            id: 'law-diff',
            text: '法案對照',
          },
        ],
      },
    });
  }, []);

  const navigationButtonEventListener = Navigation.events().registerNavigationButtonPressedListener(async ({ buttonId }) => {
    switch (buttonId) {
      case props.videoUrl:
        Share.share({
          message: Platform.OS === 'android' ? props.videoUrl : null,
          url: props.videoUrl
        });
        break;
      case 'law-diff':
        try {
          const url = 'https://openfunltd.github.io/law-diff/';
          if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
            })
          } else {
            Linking.openURL(url);
          }
        } catch (error) {
          console.log(error);
        }
        break;
      }
    }
  );

  useEffect(() => {
    return () => {
      navigationButtonEventListener.remove();
    };
  });

  return (
    <WebView source={{ uri: props.videoUrl }}
             // See: https://github.com/react-native-webview/react-native-webview/issues/1035#issuecomment-956006729
             mediaPlaybackRequiresUserAction={true}
             allowsFullscreenVideo={true}
             allowsBackForwardNavigationGestures={true}
             decelerationRate={0.998} />
  );
};

export default WebScreen;
