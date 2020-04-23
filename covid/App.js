import React, { useState, Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Geocode from 'react-geocode';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
});

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      loaded: true,
      country: "",
      short: "",
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 60,
        longitudeDelta: 60
      },
      data: {
        confirmed: 0,
        active: 0,
        recovered: 0,
        dead: 0
      },
      wrld: {
        confirmed: 0,
        active: 0,
        recovered: 0,
        dead: 0
      },
      markers: []
    };

    Geocode.setApiKey('AIzaSyADngNkHzLlRz6na_xaPRCvq6EgyYiyWXU');
    Geocode.setLanguage('en');

    this.handleInput = this.handleInput.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.APIcall = this.APIcall.bind(this);
  }

  handleInput = input => {
    this.setState({userInput: input});
  }

  setCountry(country) {
    let longAddr = country;
    let shortAddr = '';
    let addr = '';

    if (longAddr.length > 15) {
      addr = longAddr.split(' ');
      for (var i in addr) {
        shortAddr += addr[i][0],
        console.log('SHORT ADDR: ' + shortAddr);
      }
    } else {
      shortAddr = longAddr;
    }

    this.setState({
      country: this.state.longAddr,
      short: shortAddr
    });
  }

  countryChange() {
    console.log('ENTERED: ' + input);

    Geocode.fromAddress(next).then(
      response => {
        const {lat, lon} = response.results[0].geometry.location;
        let country = '';
        let region = '';
        for (var i in response.results[0].address_components) {
          if (response.results[0].address_components[i].types.includes('country')) {
            country = response.results[0].address_components[i].long_name;
          }
        }

        console.log('Valentina ' + country);
        this.setState({
          region: {
            latitude: lat,
            longitude: lon
          }
        });
        this.APIcall(country);        
        this.setCountry(country);
      },
      error => {
        return;
      },
    );
  }

  APIcall(country, marker, latitude, longitude) {
    this.setState({loaded: false});
    console.log('GETTING CASES FOR ' + country);
    
    fetch('https://api.covid19api.com/total/country/' + country, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    .then(response => {
      return response.json();
    })

    .then(responseData => {
      return responseData[responseData.length - 1];
    })

    .then(data => {
      if (data === undefined) {
        this.setState({loaded: false});
        return;
      }
      this.setState((prevState, props) => {
        return {
          data: {
            confirmed: data.Confirmed,
            active: data.Confirmed - data.Recovered - data.Deaths,
            recovered: data.Recovered,
            dead: data.Deaths,
          },
        };
      });
    })

    .catch(err => {
      this.setState({loaded: false});
      console.log('ERROR: ' + err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Enter a Location to LookUp</Text>
        <TextInput 
          defaultValue="Type Here" 
          onChangeText={this.handleInput} />
        <Text>You entered: {this.state.search}</Text>
        <Text>country: {this.state.country}</Text>
      </View>
    );
  }
}
