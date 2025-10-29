import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CareTakerAlert() {
  const [time, setTime] = useState('');

  // real time 
  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setTime(`${hours} : ${minutes}`);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every 1 min
    return () => clearInterval(interval);
  }, []);

  const handleGotIt = () => {
    Alert.alert("Task Completed", "You have acknowledged this task.");
  };

  return (
    <View style={styles.container}>

      <View style={styles.alertBox}>
        <Text style={styles.time}>{time}</Text>

        {/* Egg icon from MaterialCommunityIcons */}
        <MaterialCommunityIcons name="egg" size={80} color="#2E50AA" style={styles.icon} />

        <Text style={styles.message}>
          It’s time to eat!!{'\n'}enjoy your meal 🍽️
        </Text>
      </View>

      <Text style={styles.taskTitle}>Dinner Time</Text>

      <Pressable style={styles.button} onPress={handleGotIt}>
        <Text style={styles.buttonText}>GOT IT</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  alertBox: {
    width: '100%',
    backgroundColor: '#E6EFFA',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  time: {
    fontSize: 40,
    color: '#555555',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 35,
    color: '#000000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#AFC6ED',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: '#000000',
    fontSize: 25,
    fontWeight: '500',
  },
});
