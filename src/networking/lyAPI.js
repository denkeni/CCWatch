import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalStore } from '../global.js';
import Papa from 'papaparse';

// API documentation: https://data.ly.gov.tw/getds.action?id=421
const csvAPIURL = 'https://data.ly.gov.tw/odw/usageFile.action?id=421&type=CSV&fname=421_'
+ '1103'
+ 'CSV-1.csv';

export const getWatchingLegislators = async () => {
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

export const parsedJSONData = (dataString, filteredName) => {
  const papaResult = Papa.parse(dataString);
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
  let videoUrlIndex = keyArray.indexOf('videoUrl');
  if (videoUrlIndex === -1) {
    videoUrlIndex = keyArray.indexOf('videoURL');
  }

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
    if (filteredName !== undefined &&
        filteredName !== legislatorName) {
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
};
