import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator
} from "react-native";

export default function App() {
  const [busTime, setBusTime] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate fetching bus arrival time
  const fetchBusTime = () => {
    setLoading(true);

    // Simulating API call with a timeout
    setTimeout(() => {
      // In a real app, replace this with actual API fetch
      // Random minutes for demonstration purposes
      const minutes = Math.floor(Math.random() * 30);
      setBusTime(`${minutes} minutes`);
    }, 2000);
  };

  // Fetch bus time when component mounts
  useEffect(() => {
    fetchBusTime();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bus arrival time:</Text>
        <Text style={styles.timeText}>
          {loading ? <ActivityIndicator size="large" /> : busTime}
        </Text>
        <Pressable style={styles.refreshButton} onPress={fetchBusTime}>
          <Text style={styles.buttonText}>Refresh!</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  timeText: {
    fontSize: 48,
    marginBottom: 40
  },
  refreshButton: {
    backgroundColor: "#396B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  }
});
