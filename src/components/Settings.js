import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Navigation } from "react-native-navigation";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SelectButton } from './SelectButton.js';
import { dataStringFromNetworkFetching, setCacheDataString, getCacheDataString } from '../networking/lyAPI.js';
import { useGlobalStore } from '../global.js';
import contributors from '../data/contributors.js';
import { kBackgroundColor } from '../styles/globalStyles.js';

export const SettingsScreen = (props) => {

  const {setGlobalCacheDataString, getGlobalCacheDataString} = useGlobalStore();

  // See: https://github.com/oblador/react-native-vector-icons/issues/965#issuecomment-810501767
  MaterialIcons.loadFont();

  useEffect(() => {
    // See: https://stackoverflow.com/a/53572588/3796488
    async function preloadData() {
      const dataString = await dataStringFromNetworkFetching();
      setGlobalCacheDataString(dataString);
    }
    if (props.shouldPreloadData) {
      preloadData();
    }
  }, []);

  return (
    <View style={styles.container}>
      <SelectButton />
      <View style={styles.bottomContainer}>
        <Pressable
          android_ripple={{ color: 'white' }}
          style={({ pressed }) => [
            {
              ...Platform.select({
                ios: {
                  backgroundColor: pressed ? kBackgroundColor : 'whitesmoke',
                },
                android: {
                  backgroundColor: 'gainsboro',
                }
              })
            },
            styles.button,
          ]}
          onPress={() => {
            Navigation.showModal({
              stack: {
                children: [{
                  component: {
                    name: 'TextView',
                    passProps: {
                      text: contributors
                    },
                    options: {
                      topBar: {
                        title: {
                          text: '特別感謝'
                        }
                      }
                    }
                  }
                }]
              }
            });
          }
        }>
          {({ pressed }) => (
            <Text style={{...styles.textStyle, color: pressed ? 'gray' : 'black'}}>特別感謝ヽ(＾Д＾)ﾉ</Text>
          )}
        </Pressable>
        <Text style={styles.textStyle}>本專案不代表立法院官方立場</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: kBackgroundColor,
  },
  bottomContainer: {
  },
  button: {
    marginHorizontal: 50,
    marginVertical: 10,
    elevation: 2,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    height: 50,
    paddingVertical: 15,
  },
});

SettingsScreen.options = {
  topBar: {
    title: {
      text: '設定'
    }
  }
};
