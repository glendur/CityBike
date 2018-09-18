import React from 'react';
import { Text } from 'react-native';
import Card from './felles/Card';
import CardSection from './felles/CardSection';
import Button from './felles/Button';


const StationDetails = ({ station, handleClick, activeStations, activeStationNames }) => {
  const { headerTextStyle, leftPartStyle, rightPartStyle, pressedStyle, buttonStyle } = styles;

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
          style={activeStationNames.includes(station.name) ? pressedStyle : buttonStyle}
        >
           Abonner
        </Button>
      </CardSection>

    </Card>
  );
};

const styles = {
  textStyle: {
    fontSize: 14
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
    backgroundColor: 'green',
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
