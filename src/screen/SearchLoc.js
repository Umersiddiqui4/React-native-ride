import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function SearchLoc() {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const searchPlaces = async (text) => {
    setPickup(null); // Clear previous selected pickup

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq32dYZvahdoiWKylNmr9Ggca5P8wDpLXMGgKQsTM5yiuA='
        }
      };

      const { latitude, longitude } = currentLocation.coords;
      const response = await fetch(`https://api.foursquare.com/v3/places/search?query=${text}&ll=${latitude},${longitude}&radius=9000`, options);
      const data = await response.json();
      console.log(data);
      setPlaces(data.results);
    } catch (error) {
        console.error(error);
        setErrorMsg('Error fetching places. Please try again.'); // Display error message
    }
};

const onPlaceSelect = (item) => {
    const {latitude} = item.geocodes.main
    const {longitude} = item.geocodes.main
    setPickup(item);
    setRouteCoordinates([
        {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        },
        {
            latitude,
            longitude
        }
    ]);
}
console.log(routeCoordinates ,"setRouteCoordinates");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.error(error);
        setErrorMsg('Error fetching current location. Please try again.'); // Display error message
      }
    })();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }
  const fares = {
    bike: 50,
    rickshaw: 80,
    car: 100,
    bus: 150,
    truck: 208,
    airplane: 1000
  };
  
  const calculateFare = (vehicle) => {
    const { latitude: pickupLat, longitude: pickupLong } = pickup.geocodes.main;
    const { latitude: destinationLat, longitude: destinationLong } = location.coords;
  
    const distance = calcCrow(pickupLat, pickupLong, destinationLat, destinationLong);
    const fare = fares[vehicle] * distance;
    alert(`Rs. ${fare.toFixed(2)}`);
  };
  
  // This function takes in latitude and longitude of two locations and returns the distance between them as the crow flies in kilometers
  function calcCrow(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }
  
  // Converts numeric degrees to radians
  function toRad(Value) {
    return Value * Math.PI / 180;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a place..."
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={() => searchPlaces(searchQuery)} />
      </View>
      {!pickup && (
        <View>
          {places.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => onPlaceSelect(item)}>
              <Text  style={{ height: 30, padding: 5 }}>{item.name}, {item.location.address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {pickup && (
        <View style={{ padding:10, justifyContent:"center" , display:"flex",alignItems:"center"}}>
          <Text style={{fontSize:16, marginBottom:10 }} >Your selected pickup location is</Text>
          <Text  >{pickup.name}, {pickup.location.address}</Text>
        </View>
      )}
      {location && (
        <MapView
        provider={MapView.PROVIDER_GOOGLE} 
        
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0020,
            longitudeDelta: 0.0010,
          }}
          style={styles.map}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <Image
              source={{
                uri: 'https://media.baamboozle.com/uploads/images/641697/1667728837_183671_gif-url.gif',
              }}
              style={{ height: 60, padding: 15 }}
            />
          </Marker>
          {pickup && (
            <Marker
              coordinate={{
                latitude: pickup.geocodes.main.latitude,
                longitude: pickup.geocodes.main.longitude,
              }}
            >
              <Image
                source={{
                  uri: 'https://media.baamboozle.com/uploads/images/641697/1667728837_183671_gif-url.gif',
                }}
                style={{ height: 60, padding: 15 }}
              />
            </Marker>
          )}
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={2}
            strokeColor='#7F0000'
          />
        </MapView>
      )}
      {pickup && location ? <View  style={{ height: 120, padding: 15 , display:"flex", flexDirection:"row", position:"relative",backgroundColor:"#c9c9c9" }}>
        <TouchableOpacity style={styles.rides} onPress={() => calculateFare("bike")}> 
                <Image style={{ height:"100%",
    width:"80%",marginLeft:10 }}   source={require('../img/bike (1).gif')}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => calculateFare("car")}  style={styles.ride}> 
                <Image style={styles.img}  source={require('../img/car.gif')}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ride} onPress={() => calculateFare("rickshaw")}> 
                <Image style={styles.img}  source={require('../img/rakshaw.gif')}></Image>
        </TouchableOpacity>
     
      </View>
      :""
    }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  map: {
    flex: 1,
  },
  ride:{
    flex:1,
    backgroundColor:"white",
    margin:3,
    position:"relative",
    bottom:50,
    // padding:10,
    borderRadius:20,
    overflow:"hidden"
  },
  rides:{
    flex:1,
    backgroundColor:"white",
    margin:3,
    position:"relative",
    bottom:50,
    padding:10,
    borderRadius:20
  }
  ,
  img:{
    height:"100%",
    width:"100%"
  }
});
