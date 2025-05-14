import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator
} from "react-native";

const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=83139";

export default function App() {
  const [busTime, setBusTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [relativeTime, setRelativeTime] = useState("");

  // Format bus arrival time as relative time (e.g., "5 minutes")
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "No arrival time";
    
    // Calculate minutes until arrival
    const now = new Date();
    const arrivalTime = new Date(timestamp);
    const minutesLeft = Math.floor((arrivalTime - now) / 60000);
    
    if (minutesLeft < 0) return "Departed";
    if (minutesLeft === 0) return "Arriving";
    if (minutesLeft === 1) return "1 minute";
    if (minutesLeft < 60) return `${minutesLeft} minutes`;
    
    // For times more than an hour away
    const hours = Math.floor(minutesLeft / 60);
    const mins = minutesLeft % 60;
    return `${hours} hr${hours > 1 ? 's' : ''} ${mins ? `${mins} min` : ''}`;
  };

  // Simulate fetching bus arrival time
  const fetchBusTime = () => {
    setLoading(true);

    fetch(BUSSTOP_URL)
      .then((response) => response.json()) // convert blob to JSON
      .then((responseData) => {
        // now responseData is JSON
        console.log(responseData);

        const myBus = responseData.services.filter(
          (item) => item.no === "155"
        )[0];
        console.log(`My bus is`);
        console.log(myBus);
        setBusTime(myBus.next.time);
        setRelativeTime(formatRelativeTime(myBus.next.time));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching bus data:", error);
        setLoading(false);
      });
  };

  // Update the relative time every minute
  useEffect(() => {
    if (busTime) {
      setRelativeTime(formatRelativeTime(busTime));
      
      // Update countdown every minute
      const interval = setInterval(() => {
        setRelativeTime(formatRelativeTime(busTime));
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [busTime]);

  // Fetch bus time when component mounts
  useEffect(() => {
    fetchBusTime();
    
    // Auto refresh data every 30 seconds
    const refreshInterval = setInterval(fetchBusTime, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bus arrival time:</Text>
        <Text style={styles.timeText}>
          {loading ? <ActivityIndicator size="large" /> : relativeTime}
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
