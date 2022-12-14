/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  PlatformColor,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { Navigation } from "react-native-navigation";
import { WebScreen } from './Webview.js';
import { SettingsScreen, setTabsFromLegislators } from './Settings.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Papa from 'papaparse';
import { observer } from 'mobx-react-lite';
import { useGlobalStore } from './global.js';
import { csvAPIURL } from './data.js';

const getWatchingLegislators = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('watching_legislators');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(error) {
    Alert.alert(
      "警告：立委清單讀取失敗",
      error.name + ': ' + error.message,
      [{ text: "好的",
         style: "cancel" }],
      { cancelable: true }
    );
  }
}

export const dataStringFromNetworkFetching = async () => {
  const csv = await fetch(csvAPIURL);
  const csvStr = await csv.text();
  return csvStr;
}

const Item = ({ title, content, videoUrl, homeComponentId }) => (
  <TouchableOpacity
    onPress={() => Navigation.push(homeComponentId, {
          component: {
            name: 'Web',
            options: {
              topBar: {
                title: {
                  text: title
                },
              },
            },
            passProps: {
              videoUrl: videoUrl
            }
          }
        })}>
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>{content}</Text>
    </View>
  </TouchableOpacity>
);

const App: () => Node = (props) => {
  // Style
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,    // fill the screen height
  };

  const renderItem = ({ item }) => (
    <Item title={item.date+ ' ' + item.speechStartTime + ' ' + item.legislatorName + '\n' + item.typeName}
          content={item.content}
          videoUrl={item.videoUrl}
          homeComponentId={homeComponentId}
    />
  );

  // Data
  const {
    isGlobalFetching,
    setIsGlobalFetchingTrue,
    setIsGlobalFetchingFalse,
    addFetchedListener,
    setGlobalCacheDataString,
    getGlobalCacheDataString
  } = useGlobalStore();
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const homeComponentId = props.componentId;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setDataFromNetworkFetching().then(
      () => setRefreshing(false)
    );
  }, []);

  const getMeetings = async () => {
    console.log(isGlobalFetching);
    if (isGlobalFetching) {
      console.log("WAITING");
      setDataFromCacheDataString();
      return;
    }
    // See: https://stackoverflow.com/a/35612484/3796488
    await Promise.all([setDataFromCacheDataString(),
                       setDataFromNetworkFetching()]);
  }

  const setDataFromCacheDataString = () => {
    const cacheDataString = getGlobalCacheDataString();
    if (typeof(cacheDataString) === 'string') {
      const papaResult = Papa.parse(cacheDataString);
      const data = parsedJSONData(papaResult);
      setData(data);
      setLoading(false);
      console.log("USE CACHE");
    }
  }

  const setDataFromNetworkFetching = async () => {
      console.log("FETCHING...");
      setIsGlobalFetchingTrue();
      const dataString = await dataStringFromNetworkFetching();
      const papaResult = Papa.parse(dataString);
      const data = parsedJSONData(papaResult);
      console.log("FETCHED.")
      setData(data);
      setLoading(false);
      setGlobalCacheDataString(dataString);
      setIsGlobalFetchingFalse();
  }

  function parsedJSONData(papaResult) {
    // generating indexes...
    const resultArrays = papaResult['data'];
    const keyArray = resultArrays[0];
    const dateIndex = keyArray.indexOf('meetingDate');
    const timeIndex = keyArray.indexOf('meetingTime');
    const typeNameIndex = keyArray.indexOf('meetingTypeName');
    const contentIndex = keyArray.indexOf('meetingContent');
    const legislatorNameIndex = keyArray.indexOf('legislatorName');
    const areaNameIndex = keyArray.indexOf('areaName');
    const speechStartTimeIndex = keyArray.indexOf('speechStartTime');
    const speechRecordUrlIndex = keyArray.indexOf('speechRecordUrl');
    const videoUrlIndex = keyArray.indexOf('videoUrl');

    let data = Array();
    // Start from latest; skip index 0 (key array)
    for (let i = resultArrays.length - 1; i > 0; i--) {
      const array = resultArrays[i];
      const date = array[dateIndex];
      const time = array[timeIndex];
      const typeName = array[typeNameIndex];
      const content = array[contentIndex];
      const legislatorName = array[legislatorNameIndex];
      const areaName = array[areaNameIndex];
      const speechStartTime = array[speechStartTimeIndex];
      const speechRecordurl = array[speechRecordUrlIndex];
      const videoUrl = array[videoUrlIndex];
      if (!legislatorName) {
        continue;
      }
      if (!props.isAll && props.name !== legislatorName) {
        continue;
      }
      const obj = {
        "date": date,
        "time": time,
        "typeName": typeName,
        "content": content,
        "legislatorName": legislatorName,
        "areaName": areaName,
        "speechStartTime": speechStartTime,
        "speechRecordurl": speechRecordurl,
        "videoUrl": videoUrl,
        "key": date + speechStartTime + legislatorName
      };
      data.push(obj);
    }
    return data;
  }

  useEffect(() => {
    getMeetings();
    addFetchedListener(() => {
      console.log("UPDATED FROM other FETCHED.");
      setDataFromCacheDataString();
    });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoading ? <ActivityIndicator style={{marginTop:20}}/> : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const kPrimaryColor = 'crimson';

const kBackgroundColor = Platform.select({
  ios: () => PlatformColor('systemBackground'),
  android: () => PlatformColor('?android:attr/colorBackground'),
  default: () => 'white'
})();

const kCellBackgroundColor = Platform.select({
  ios: () => PlatformColor('secondarySystemBackground'),
  android: () => PlatformColor('?android:attr/colorBackgroundFloating'),
  default: () => 'white'
})();

const kTextColor = Platform.select({
  ios: () => PlatformColor('label'),
  android: () => PlatformColor('?android:attr/colorPrimary'),
  default: () => 'black'
})();

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
    backgroundColor: kCellBackgroundColor
  },
  title: {
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
  },
});

Navigation.registerComponent('Home', () => App);
Navigation.registerComponent('Web', () => WebScreen);
Navigation.registerComponent('Settings', () => SettingsScreen);

Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: kBackgroundColor
  },
  topBar: {
    title: {
      color: kTextColor
    },
    backButton: {
      color: kPrimaryColor
    },
    background: {
      backgroundColor: kBackgroundColor
    }
  },
  bottomTab: {
    fontSize: 14,
    selectedFontSize: 14,
    textColor: kTextColor,
    selectedTextColor: kPrimaryColor,
    iconColor: kTextColor,
    selectedIconColor: kPrimaryColor,
  },
  bottomTabs: {
    titleDisplayMode: 'alwaysShow'
  }
});

Navigation.events().registerAppLaunchedListener(() => {
  getWatchingLegislators().then(legislators => {
    setTabsFromLegislators(legislators);
  });
});

export default App;
