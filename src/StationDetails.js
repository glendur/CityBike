/* eslint-disable max-len */
import React from 'react';
//import _ from 'lodash';
import { Text } from 'react-native';
import Card from './felles/Card';
import CardSection from './felles/CardSection';
import Button from './felles/Button';


const StationDetails = ({ station, handleClick, activeStationNames }) => {
  const { headerTextStyle, leftPartStyle, rightPartStyle, pressedStyle, buttonStyle } = styles;
  //Bruke dette forholdstallet til dynamisk styling, ser ikke bra ut med bottomborder, noe annet?
  //const forhold = 10 * ((_.toInteger(station.free_bikes) / (_.toInteger(station.extra.slots))));

  if (activeStationNames.includes(station.name)) {
    return (
      <Card style={{ flex: 1, flexDirection: 'row' }}>
        <CardSection style={leftPartStyle}>
          <Text style={headerTextStyle}>
            {station.name}
          </Text>
          <Text>
          Free bikes: {station.free_bikes}
          </Text>
        </CardSection>
        <CardSection style={rightPartStyle} >
          <Button
            onPress={() => handleClick(station)}
            style={pressedStyle}
          >
             Myas
          </Button>
        </CardSection>

      </Card>
    );
  } return (
      <Card style={{ flex: 1, flexDirection: 'row' }}>
        <CardSection style={leftPartStyle}>
          <Text style={headerTextStyle}>
            {station.name}
          </Text>
          <Text>
          Free bikes: {station.free_bikes}
          </Text>
        </CardSection>
        <CardSection style={rightPartStyle} >
          <Button
            onPress={() => handleClick(station)}
            style={buttonStyle}
          >
             Abonner
          </Button>
        </CardSection>

      </Card>
    );
};

const styles = {
  textStyle: {
    fontSize: 14,
    opacity: 1
  },
  leftPartStyle: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  rightPartStyle: {
    flex: 1
  },
  pressedStyle: {
    backgroundColor: '#007aff',
    fontWeight: '900',
    color: 'white'

  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  buttonStyle: {
    backgroundColor: '#fff',
  }
};

export default StationDetails;
