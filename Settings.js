import React, { useEffect, useState, useRef } from 'react';
import { View, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { legislatorItems, committeeOfLegislator } from './legislators.js';
import { Navigation } from "react-native-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataStringFromNetworkFetching, setCacheDataString, getCacheDataString } from './App.js';
import { useGlobalStore } from './global.js';

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
      MaterialIcons.getImageSource('settings', 25),
      MaterialIcons.getImageSource('account-circle', 25)
  ]);
  const [ settingsIcon, personIcon ] = icons;
  return { settingsIcon, personIcon };
}

export const setTabsFromLegislators = async (value) => {
  const tabs = [];
  const legislators = value === null ? [] : value;
  const icons = await prepareIcons();
  for (var legislator of legislators) {
    const tab = {
      stack: {
        children: [{
          component: {
            name: 'Home',
            passProps: {
              name: legislator,
              isAll: false
            }
          }
        }],
        options: {
          topBar: {
            title: {
              // FIXME: This does not work on iOS. A bug!
              // See: https://github.com/wix/react-native-navigation/issues/5853#issuecomment-789168930
              text: legislator + "（" + committeeOfLegislator(legislator) + "）"
            }
          },
          bottomTab: {
            text: legislator,
            icon: icons.personIcon
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
          icon: icons.settingsIcon
        }
      }
    }
  };
  tabs.push(settingsTab);
  const newRoot = {
    root: {
      bottomTabs: {
        children: tabs
      }
    }
  };
  Navigation.setRoot(newRoot);
}

export const SettingsScreen = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const ref = useRef(null);

  const onSelectedItemsChange = (items) => {
    if (items.length > 4) {
      Alert.alert(
        "提醒",
        "最多支援關注 4 位立委喔",
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
    <SectionedMultiSelect
      items={legislatorItems}
      IconRenderer={MaterialIcons}
      uniqueKey="name"
      subKey="legislators"
      displayKey="title"
      selectText="選擇你要監督的立委（最多 4 位）"
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
    />

  );
};

SettingsScreen.options = {
  topBar: {
    title: {
      text: '設定'
    }
  }
};
