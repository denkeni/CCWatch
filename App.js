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
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { Navigation } from "react-native-navigation";

const Item = ({ title, content, videoUrl, homeComponentId }) => (
  <TouchableOpacity
    onPress={() => Navigation.push(homeComponentId, {
          component: {
            name: 'Web',
            options: {
              topBar: {
                title: {
                  text: 'Web'
                }
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
    <Item title={item.date+ ' ' + item.time + ' ' + item.legislatorName + '\n' + item.typeName}
          content={item.content}
          videoUrl={item.videoUrl}
          homeComponentId={homeComponentId}
    />
  );

  // Data
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const homeComponentId = props.componentId;

  const getMeetings = async () => {
    const Papa = require('papaparse');
    const csv = await fetch('https://data.ly.gov.tw/odw/usageFile.action?id=148&type=CSV&fname=148_1004CSV-1.csv');
    const csvStr = await csv.text();
    const result = Papa.parse(csvStr);

    // generating indexes...
    const resultArrays = result['data'];
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
      const obj = { "date": date,
                    "time": time,
                    "typeName": typeName,
                    "content": content,
                    "legislatorName": legislatorName,
                    "areaName": areaName,
                    "speechStartTime": speechStartTime,
                    "speechRecordurl": speechRecordurl,
                    "videoUrl": videoUrl,
                    "key": speechStartTime + legislatorName
                  };
      data.push(obj);
    }

    setData(data);
    setLoading(false);
  }

  useEffect(() => {
    getMeetings();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
        />
      )}
    </SafeAreaView>
  );
};

App.options = {
  topBar: {
    title: {
      text: '首頁'
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'gainsboro',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
});

const WebScreen = (props) => {
  return (
    <Text>{props.videoUrl}</Text>
  );
}

Navigation.registerComponent('Home', () => App);
Navigation.registerComponent('Web', () => WebScreen);
Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               name: 'Home'
             }
           }
         ]
       }
     }
  });
});

export default App;
