import React, { Component } from 'react';
import axios from 'axios';
import { ScrollView } from 'react-native';
import StationDetails from './StationDetails';


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { stations: [], pressStatus: false, activeStations: [] };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    axios.get('https://api.citybik.es/v2/networks/trondheim-bysykkel')
      .then(response => this.setState({ stations: response.data.network.stations }));
  }

  pushIfEmpty() { //Or few bikes
    const { activeStations, stations } = this.state;
    const felles = activeStations.filter(value => stations.includes(value));


    //Finne felles med stations-arrayet, trekke ut disse objektene, skaffe antallet sykler
    //hvis noen er lik null, vil det si at det skal sendes pushvarsler.
    //Hvis denne funksjonen kjøres ved scrolling, skal det endres farge på selve stationdetails,
    //hvis funksjonen blir callet fordi det har gått fem minutter siden sist oppdatering
    //(enten fem minutter siden sist drag-to-refresh, eller at det er fem minutter siden sist automagisk
    //oppdatering - dette kan nok fort bli slitsomt, kanskje dette kun er funksjon i pushIfBeingFIlled.
  }
  pushIfBeingFilled() {
    //Hvis en stasjon som ligger i empty-arryet også finnes i activestations-arrayet
    //og samtidig blir fylt på, skal det pushes til applikasjonen
  }


  handleClick(name) {
    const { activeStations } = this.state;
    const activeStationsEditable = activeStations;
      if (!activeStations.includes(name)) {
        activeStationsEditable.push(name);
      } else if (this.state.activeStations.includes(name)) {
        activeStationsEditable.splice(activeStationsEditable.indexOf(name), 1);
      }
      console.log(activeStationsEditable);
      this.setState({ activeStations: activeStationsEditable });
    }


  renderStations() {
    return this.state.stations.map((stations) =>
      <StationDetails
        activeStations={this.state.activeStations}
        handleClick={this.handleClick}
        pressStatus={this.state.pressStatus}
        key={stations.id}
        stations={stations}
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
