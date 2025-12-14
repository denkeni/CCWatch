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
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { Navigation } from "react-native-navigation";
import { SettingsScreen } from './components/Settings.js';
import { setTabsFromLegislators } from './components/SelectButton.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebScreen from './components/Webview.js';
import TextViewScreen from './components/TextView.js';

import styles from './styles/meetingListStyles.js';
import {
  kPrimaryColor,
  kBackgroundColor,
  kCellBackgroundColor,
  kTextColor,
} from './styles/globalStyles.js';

import { observer } from 'mobx-react-lite';
import { useGlobalStore } from './global.js';
import SearchComponentAndroid from './components/SearchComponentAndroid.js';
import {
  getWatchingLegislators,
  dataStringFromNetworkFetching,
  parsedJSONData,
} from './networking/lyAPI.js';

const MeetingItem = ({ date, time, title, subtitle, content, videoUrl, homeComponentId }) => (
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
      <View style={styles.dateBox}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  </TouchableOpacity>
);

const ListEmptyView = () => (
  <Text style={[{textAlign: 'center', marginTop: 60}, styles.content]}>尚無質詢紀錄</Text>
);

const App: () => Node = (props) => {
  // Style
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,    // fill the screen height
  };

  const renderItem = ({ item }) => (
    <MeetingItem date={item.date}
                 time={item.speechStartTime}
                 title={item.legislatorName}
                 subtitle={item.typeName}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
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
      const data = parsedJSONData(cacheDataString, props.name);
      setData(data);
      setLoading(false);
      console.log("USE CACHE");
    }
  }

  const setDataFromNetworkFetching = async () => {
      console.log("FETCHING...");
      setIsGlobalFetchingTrue();
      const dataString = await dataStringFromNetworkFetching();
      const data = parsedJSONData(dataString, props.name);
      console.log("FETCHED.")
      setData(data);
      setLoading(false);
      setGlobalCacheDataString(dataString);
      setIsGlobalFetchingFalse();
  }

  useEffect(() => {
    getMeetings();
    addFetchedListener(() => {
      console.log("UPDATED FROM other FETCHED.");
      setDataFromCacheDataString();
    });
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      if (searchQuery === '') {
        return true;
      }
      const itemData = `${item.date} ${item.legislatorName} ${item.typeName} ${item.content}`;
      const queryData = searchQuery;
      return itemData.indexOf(queryData) > -1;
    });
    setFilteredData(filtered);
  }, [data, searchQuery]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          searchBar: {
            visible: true,
            placeholder: '搜尋關鍵字',
          }
        }
      });

      const listener = Navigation.events().registerSearchBarUpdatedListener(
        ({ componentId, text, isFocused }) => {
          if (componentId === props.componentId && isFocused) {
            setSearchQuery(text);
          }
        }
      );
      return () => listener.remove();
    } else if (Platform.OS === 'android') {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          title: {
            component: {
              name: 'SearchAndroid',
              passProps: {
                onSearch: (text) => setSearchQuery(text)
              }
            }
          }
        }
      });
    }
  }, [props.componentId]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoading ? <ActivityIndicator style={{marginTop:20}}/> : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={ListEmptyView}
        />
      )}
    </SafeAreaView>
  );
};

Navigation.registerComponent('Home', () => App);
Navigation.registerComponent('Web', () => WebScreen);
Navigation.registerComponent('Settings', () => SettingsScreen);
Navigation.registerComponent('TextView', () => TextViewScreen);
Navigation.registerComponent('SearchAndroid', () => SearchComponentAndroid);

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
  },
  layout: {
    backgroundColor: kBackgroundColor, // for iOS 12 compatibility
  },
});

Navigation.events().registerAppLaunchedListener(() => {
  getWatchingLegislators().then(legislators => {
    setTabsFromLegislators(legislators);
  });
});

export default App;
