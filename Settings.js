import React, { useState, useRef } from 'react';
import { View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { legislatorItems } from './legislators.js';
import { Navigation } from "react-native-navigation";

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
     const tabs = [];
     for (var legislator of selectedItems) {
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
                 text: legislator
               }
             },
             bottomTab: {
               text: legislator
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
             name: 'Settings'
           }
         }],
         options: {
             topBar: {
               title: {
                 // FIXME: This does not work on iOS. A bug?
                 text: legislator
               }
             },
             bottomTab: {
               text: legislator
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
  };

  // See: https://github.com/oblador/react-native-vector-icons/issues/965#issuecomment-810501767
  Icon.loadFont();

  return (
    <SectionedMultiSelect
      items={legislatorItems}
      IconRenderer={Icon}
      uniqueKey="name"
      subKey="legislators"
      displayKey="name"
      selectText="選擇你要監督的立委（最多 4 位）"
      searchPlaceholderText="搜尋關鍵字"
      confirmText="完成"
      showDropDowns={true}
      readOnlyHeadings={true}
      onSelectedItemsChange={onSelectedItemsChange}
      onConfirm={onConfirm}
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
  },
  bottomTab: {
    text: '設定'
  }
};
