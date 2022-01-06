// See: https://wix.github.io/react-native-navigation/docs/third-party-mobx/
import React from 'react';
import { makeAutoObservable, action, observable } from 'mobx';

class GlobalStore {
  isGlobalFetching = false;
  cacheDataString;  // react-native-fs severely downgraded user experience, performance was extremely bad and even slower than API fetching...use in-memory cache instead.
  _listeners;

  constructor() {
    makeAutoObservable(this, {
      isGlobalFetching: observable,
      cacheDataString: observable,
      setIsGlobalFetchingTrue: action.bound,
      setIsGlobalFetchingFalse: action.bound,
      setGlobalCacheDataString: action.bound,
      getGlobalCacheDataString: action.bound
    });
    _listeners = new Array();
  }

  // See: https://github.com/react-native-async-storage/async-storage/issues/401#issuecomment-684015162
  addFetchedListener(listener: () => void) {
    _listeners.push(listener);
  }

  setIsGlobalFetchingTrue() {
    this.isGlobalFetching = true;
  }

  setIsGlobalFetchingFalse() {
    this.isGlobalFetching = false;
    _listeners.forEach(listener => listener());
  }

  setGlobalCacheDataString(dataString) {
    this.cacheDataString = dataString;
  }

  getGlobalCacheDataString() {
    return this.cacheDataString;
  }
}

// Instantiate the global store.
const globalStore = new GlobalStore();
// Create a React Context with the global store instance.
const GlobalStoreContext = React.createContext(globalStore);
export const useGlobalStore = () => React.useContext(GlobalStoreContext)
