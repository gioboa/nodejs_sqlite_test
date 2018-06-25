import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { addClient, clearClientList, getClients } from './reducer';

class Home extends Component {
  componentDidMount() {
    setInterval(() => this.props.getClients(), 2000);
  }
  addClient() {
    this.props.addClient({ name: 'Test', surname: new Date().toLocaleString('en-US') });
  }
  render() {
    const { clients } = this.props;
    return (
      <View style={styles.container}>
        <Button onPress={() => this.addClient()} title="Add client" />
        {clients.map((client, index) => (
          <Text key={index}>
            {index} - {client.name} - {client.surname}
          </Text>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50
  }
});

const mapStateToProps = state => {
  return {
    clients: state.clients
  };
};

const mapDispatchToProps = {
  getClients,
  addClient,
  clearClientList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
