import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import threeEntryPoint from "./threejs/threeEntryPoint"

class App extends Component {
  componentDidMount() {
    threeEntryPoint(this.threeRootElement)
  }
  render() {
    return ( <div ref={el => this.threeRootElement = el}></div>);
  }
}

export default App;
