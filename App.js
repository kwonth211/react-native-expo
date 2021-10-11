import * as Location from 'expo-location'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const OPEN_WEATHER_API_KEY = '85e580707bfc440c03978e1ecf8fbff5'
export default function App() {
  const [ok, setOk] = useState()
  const [city, setCity] = useState('Loading City..')
  const [days, setDays] = useState([])

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync()

    if (!granted) {
      setOk(false)
    }

    const {
      coords: { latitude, longitude }
    } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${OPEN_WEATHER_API_KEY}&units=metric`
    )

    const { daily } = await response.json()

    setDays(daily)
  }

  useEffect(() => {
    getLocation()
  }, [])

  console.log(days.length)
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.weather}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato'
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    color: 'black',
    fontSize: 68,
    fontWeight: '500'
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center'
  },
  temp: {
    marginTop: 50,
    fontSize: 178
  },
  description: {
    marginTop: -20,
    fontSize: 60
  },
  tinyText: {
    fontSize: 20
  }
})
