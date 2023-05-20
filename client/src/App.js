import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
    };
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_SERVER_PATH)
        .then((res) => res.text())
        .then((data) => this.setState({caption: data}))
        .catch((error) => console.log(error));
  }

  render() {
    return (
      <p>
        Hello world!
        <br/>
        {this.state.caption}
      </p>
    );
  }
}

export default App;
