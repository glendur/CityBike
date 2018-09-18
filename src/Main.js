import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { ScrollView, Alert } from 'react-native';
import StationDetails from './StationDetails';


class Main extends Component {
  constructor(props) {
    super(props);
    //Stygg løsning med to ulike arrays, ett for kun navn, et annet for selve objektet.
    //Dette er nødvendig pga. objektene i activeStations bytter minneallokasjon, og kan derfor ikke sjekkes mot hverandre,
    //Hva med _.isEqual
    this.state = { stations: [], activeStations: [], firstLaunch: true, activeStationNames: [] };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.state.firstLaunch) {
      axios.get('https://api.citybik.es/v2/networks/trondheim-bysykkel')
        .then(response => this.setState({ stations: response.data.network.stations,
          firstLaunch: false }));
    }

    setInterval(() => {
      axios.get('https://api.citybik.es/v2/networks/trondheim-bysykkel')
        .then(response => this.setState({ stations: response.data.network.stations }));
    }, 5000);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.alertSubs(prevProps, prevState, snapshot);

  }

  alertSubs(prevProps, prevState, snapshot) { //Or few bikes
    const { activeStations, stations } = this.state;
    //Bruke _.isEqual her?
    for (const actStation of activeStations) {
      for (const station of stations) {
        if (_.isEqual(actStation, station)) {
          console.log('Det er kun ', station.free_bikes, ' sykler igjen på ', actStation.name);
        }
      }
  }
    //const felles = activeStations.filter(value => stations.includes(value));

    //Finne felles med stations-arrayet, trekke ut disse objektene, skaffe antallet sykler
    //hvis noen er lik null, vil det si at det skal sendes pushvarsler.
    //Hvis denne funksjonen kjøres ved scrolling, skal det endres farge på selve stationdetails,
    //hvis funksjonen blir callet fordi det har gått fem minutter siden sist oppdatering
    //(enten fem minutter siden sist drag-to-refresh, eller at det er fem minutter siden sist automagisk
    //oppdatering - dette kan nok fort bli slitsomt, kanskje dette kun er funksjon i pushIfBeingFIlled.
  }


  pushIfBeingFilled() {

  }


  handleClick(station) {
    const { activeStations, activeStationNames } = this.state;
    const activeStationsEditable = activeStations;
    const activeStationNamesEditable = activeStationNames;
      if (!activeStations.includes(station)) {
        activeStationsEditable.push(station);
        activeStationNamesEditable.push(station.name);
      } else if (this.state.activeStations.includes(station)) {
        activeStationsEditable.splice(activeStationsEditable.indexOf(station), 1);
        activeStationNamesEditable.splice(activeStationNamesEditable.indexOf(station), 1);
      }
      this.setState({ activeStations: activeStationsEditable,
         activeStationNames: activeStationNamesEditable });
    }


  renderStations() {
    return this.state.stations.map((stations) =>
      <StationDetails
        activeStations={this.state.activeStations}
        handleClick={this.handleClick}
        key={stations.id}
        station={stations}
        activeStationNames={this.state.activeStationNames}
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
