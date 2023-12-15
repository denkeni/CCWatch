import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { legislatorItems, committeeOfLegislator } from '../data/legislator.js';
import { Navigation } from "react-native-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataStringFromNetworkFetching, setCacheDataString, getCacheDataString } from '../networking/lyAPI.js';
import { useGlobalStore } from '../global.js';
import contributors from '../data/contributors.js';
import { kBackgroundColor } from '../styles/globalStyles.js';

const storeWatchingLegislators = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
     await AsyncStorage.setItem('watching_legislators', jsonValue);
  } catch (error) {
    Alert.alert(
      "警告：立委監督清單儲存失敗",
      error.name + ': ' + error.message,
      [{ text: "好的",
         style: "cancel" }],
      { cancelable: true }
    );
  }
}

// See: https://github.com/wix/react-native-navigation/issues/5409
async function prepareIcons() {
  const icons = await Promise.all([
      MaterialIcons.getImageSource('home', 25),
      MaterialIcons.getImageSource('settings', 25),
      MaterialIcons.getImageSource('account-circle', 25)
  ]);
  const [ homeIcon, settingsIcon, personIcon ] = icons;
  return { homeIcon, settingsIcon, personIcon };
}

export const setTabsFromLegislators = async (value) => {
  const tabs = [];
  const legislators = value === null ? [] : value;
  const icons = await prepareIcons();
  const tab = {
    stack: {
      children: [{
        component: {
          name: 'Home',
        }
      }],
      options: {
        topBar: {
          title: {
            text: "最新"
          }
        },
        bottomTab: {
          text: "最新",
          icon: icons.homeIcon,
          popToRoot: true,    // for Android
        }
      }
    }
  };
  tabs.push(tab);
  for (var legislator of legislators) {
    const tab = {
      stack: {
        children: [{
          component: {
            name: 'Home',
            passProps: {
              name: legislator,
            }
          }
        }],
        options: {
          topBar: {
            title: {
              // FIXME: This does not work on iOS. A bug!
              // See: https://github.com/wix/react-native-navigation/issues/5853#issuecomment-789168930
              text: legislator
            }
          },
          bottomTab: {
            text: legislator,
            icon: icons.personIcon,
            popToRoot: true,    // for Android
          }
        }
      }
    };
    tabs.push(tab);
  }
  const settingsTab = {
    stack: {
      children: [{
        component: {
          name: 'Settings',
          passProps: {
            shouldPreloadData: legislators.length === 0 ? true : false
          }
        }
      }],
      options: {
        bottomTab: {
          text: '設定',
          icon: icons.settingsIcon,
          popToRoot: true,    // for Android
        }
      }
    }
  };
  tabs.push(settingsTab);
  const newRoot = {
    root: {
      bottomTabs: {
        children: tabs,
        options: {
          hardwareBackButton: {
            bottomTabsOnPress: 'previous',
          },
        },
      },
    }
  };
  Navigation.setRoot(newRoot);
}

export const SettingsScreen = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const ref = useRef(null);

  const onSelectedItemsChange = (items) => {
    if (items.length > 3) {
      Alert.alert(
        "提醒",
        "最多支援關注 3 位立委喔",
        [{ text: "好的",
           style: "cancel" }],
        { cancelable: true }
      );
      return;
    }
    setSelectedItems(items);
  };

  const onConfirm = () => {
    setTabsFromLegislators(selectedItems);
    storeWatchingLegislators(selectedItems);
  };

  const onCancel = () => {
    setSelectedItems([]);
  }

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
      <SectionedMultiSelect
        items={legislatorItems}
        IconRenderer={MaterialIcons}
        uniqueKey="name"
        subKey="legislators"
        displayKey="title"
        selectText="選擇你要監督的立委（最多 3 位）"
        searchPlaceholderText="搜尋關鍵字"
        confirmText="完成"
        showCancelButton={true}
        showDropDowns={true}
        readOnlyHeadings={true}
        onSelectedItemsChange={onSelectedItemsChange}
        onConfirm={onConfirm}
        onCancel={onCancel}
        selectedItems={selectedItems}
        ref={ref}
        modalWithSafeAreaView={true}
      />
      <Pressable
        style={[styles.button]}
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
        <Text style={styles.textStyle}>特別感謝</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: kBackgroundColor,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
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
