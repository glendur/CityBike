/* eslint-disable max-len */
import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { ScrollView, AsyncStorage } from 'react-native';
import StationDetails from './StationDetails';


class Main extends Component {
  constructor(props) {
    super(props);
    //Stygg løsning med to ulike arrays, ett for kun navn, et annet for selve objektet.
    //Dette er nødvendig pga. objektene i activeStations bytter minneallokasjon,
    //og kan derfor ikke sjekkes direkte mot hverandre,
    //Hva med _.isEqual?
    this.state = { stations: [], activeStations: [], activeStationNames: [] };
    this.handleClick = this.handleClick.bind(this);
    AsyncStorage.clear();
    axios.get('https://api.citybik.es/v2/networks/trondheim-bysykkel')
      .then(response => this.setState({ stations: response.data.network.stations }))
        .catch(err => console.log('Error: ', err));
  }

  componentDidMount() {
    setInterval(() => {
      axios.get('https://api.citybik.es/v2/networks/trondheim-bysykkel')
        .then(response => this.setState({
          stations: response.data.network.stations })).catch(err => console.log('Error: ', err));
        }, 5000);
    setInterval(() => {
      this.setStations();
      //Setter stasjonene hvert 5 minutt.
    }, 300000);
    setInterval(() => {
      this.getStations();
      /*Kaller getStations hvert 5 sek. getStations kaller på sendPush (burde navngis skikkelig)
      som sjekker om stasjonene (satt hvert 5 minutt av setstations) har noen forskjell ifra actStation sine verdier
      Altså om: result.free_bikes er ulike actStation.free_bikes
      */
    }, 5000);
  }

  setStations() {
    const { stations } = this.state;
    for (const station of stations) {
      const obj = {
        name: station.name,
        free_bikes: station.free_bikes,
        empty_slots: station.empty_slots,
        id: station.id
      };
      AsyncStorage.setItem(obj.id, JSON.stringify(obj));
    }
  }


  getStations() {
    const { activeStations } = this.state;
    for (const actStation of activeStations) {
      AsyncStorage.getItem(actStation.id, (err, result) => {
        const parsed = JSON.parse(result);
        this.sendPush(parsed, actStation);
      });
    }
  }

  sendPush(result, actStation) {
    const { name, free_bikes: freeBikesNow, empty_slots: emptySlotsNow } = actStation;
    const { free_bikes: freeBikesPrev, empty_slots: emptySlotsPrev } = result;
    //Test
    if ((freeBikesPrev - freeBikesNow) > 0) {
      console.log(freeBikesPrev - freeBikesNow);
    }
    //Pushwarsler må legges inn i elif'ene her, bruker console.log inntil videre.
    //I hver av if-elsene er vi nødt til å sette stasjonene igjen
    //(viktig å bemerke seg at dette ikke er i state, men med AsyncStorage)
    //fordi vi nå er oppdatert på endringen. Om denne ikke settes, vil vi oppdateres på forskjellen
    //mellom verdiene i result og actstations regelmessig,
    //helt til funksjonen kalles på nytt i componentDidMount.
    if (_.isEqual(freeBikesNow, 0) && (freeBikesPrev > 0)) {
      console.log('Eii, nå er det ingen sykler igjen på', name);
      console.log(freeBikesNow, freeBikesPrev);
      this.setStations();
    } else if (_.isEqual(freeBikesNow, 1) && freeBikesPrev > 1) {
      console.log('Det er kun ', freeBikesNow, ' sykkel igjen på ', name);
      console.log(freeBikesNow, freeBikesPrev);
      this.setStations();
    } else if ((freeBikesNow < 6) && (freeBikesPrev > 5)) {
      console.log('Det er kun ', freeBikesNow, ' sykler igjen på ', name);
      console.log(freeBikesNow, freeBikesPrev);
      this.setStations();
    } else if (_.isEqual(emptySlotsNow, 0) && (emptySlotsPrev > 0)) {
      console.log('Det er nå fullt på ', name, '.');
      console.log(freeBikesNow, freeBikesPrev);
      this.setStations();
    }
  }

  handleClick(station) {
    const { activeStations, activeStationNames } = this.state;
    const activeStationsEditable = activeStations;
    const activeStationNamesEditable = activeStationNames;
      if (!activeStationNames.includes(station.name)) {
        activeStationsEditable.push(station);
        activeStationNamesEditable.push(station.name);
      } else if (this.state.activeStationNames.includes(station.name)) {
        activeStationsEditable.splice(activeStationsEditable.indexOf(station), 1);
        activeStationNamesEditable.splice(activeStationNamesEditable.indexOf(station.name), 1);
      }
      this.setState({ activeStations: activeStationsEditable,
         activeStationNames: activeStationNamesEditable });
    }


  renderStations() {
    return this.state.stations.map((stations) =>
      <StationDetails
        activeStations={this.state.activeStations}
        activeStationNames={this.state.activeStationNames}
        handleClick={this.handleClick}
        key={stations.id}
        station={stations}
        prevStation={this.state.returnStation}
      >
          {stations.name}
      </StationDetails>
    );
  }


  render() {
    return (
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        {this.renderStations()}
      </ScrollView>
    );
  }
}

export default Main;
