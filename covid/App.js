import React, { useState, Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import Geocode from 'react-geocode';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      loaded: true,
      country: "",
      region: {
        latitude: 42.361145,
        longitude: -71.057083,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      cases: 0,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.APIcall = this.APIcall.bind(this);
  }

  handleSearch = search => {
    this.setState({search: search});
  }

  APIcall = () => {
    if (this.state.search === '') {
      return;
    }

    this.state.loaded = false;

    Geocode.setApiKey('');
    Geocode.setLanguage('en');
    Geocode.fromAddress(this.state.search).then(
      response => {
        const {lat, lng} = response.results[0].geometry.location;
        this.setState({
          region: {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.92,
            longitudeDelta: 0.0421,
          },
        });
      },
      error => {
        console.error(error);
      },
    );

    fetch('https://api.covid19api.com/country/' + this.state.search + '/status/confirmed/live?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
      }
    )
    
    .then(response => {
      return response.json();
    })
      
    .then(responseData => {
      console.log(responseData[0]);
      return responseData[0];
    })
      
    .then(data => {
      this.setState({cases: data.Cases});
      console.log('cases: ' + data.Cases);
    })

    .catch(err => {
      console.log('fetch error' + err);
    });

    this.setState({country: this.state.search});
    this.setState({search: ''});
    if (this.state.loaded === false) {
      this.setState({loaded: true});
      console.log('DONE')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Enter a Country to LookUp</Text>
        <TextInput 
          placeholder="Search" 
          onChangeText={this.handleSearch}
          value={this.state.search} />
        <Button
          title='Search'
          onPress={this.APIcall} />
      </View>
    );
  }
}
