
import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchComponentAndroid = ({ onSearch }) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="搜尋關鍵字"
        onChangeText={onSearch}
        returnKeyType="search"
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 700, // workaround for full width
    paddingTop: 5, // workaround for vertically center-aligned
  },
  searchIcon: {
    paddingLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingLeft: 12,
    fontSize: 16,
  },
});

export default SearchComponentAndroid;
