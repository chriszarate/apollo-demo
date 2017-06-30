import React, { Component } from 'react';
import { ApolloProvider, graphql, gql } from 'react-apollo';

class Dummy extends Component {
  componentWillMount() {
    this.renderCount = 0;
    console.log('Data is present in CWM: ', this.props.data.member);
  }

  render() {
    return (
      <h4>Rendered { ++this.renderCount } times</h4>
    );
  }
}

const DummyWithData = graphql(gql`
  query {
    member { id, username }
  }
`)(Dummy);

export default function App({ client }) {
  return (
    <ApolloProvider client={ client }>
      <DummyWithData />
    </ApolloProvider>
  );
}
