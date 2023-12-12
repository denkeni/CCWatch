import React, { useEffect } from 'react';
import { Navigation } from "react-native-navigation";
import { View, ScrollView, Text, StyleSheet } from 'react-native';

const TextView = (props) => {
  useEffect(() => {
    // Add a left button to the topBar when the component mounts
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        leftButtons: [
          {
            id: 'closeButton',
            text: '關閉',
          },
        ],
      },
    });

    // Add an event listener for the left button press
    const backButtonListener = Navigation.events().registerNavigationButtonPressedListener((event) => {
      if (event.buttonId === 'closeButton') {
        Navigation.dismissModal(props.componentId);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => backButtonListener.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.longText}>{props.text}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  longText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default TextView;
