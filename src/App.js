
/**
 * royxnatw
 */

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import About from './components/About';
import LatestGallery from './containers/LatestGallery';
import TrendsGallery from './containers/TrendsGallery';
import SampleGallery from './containers/SampleGallery';
import PostDisplayer from './components/PostDisplayer';
import NotFound from './components/NotFound'
import Menu from './components/Menu';
import './App.css';

const Header = (
  <div className="app-header">
    <div className='app-title'>Beautyland</div>
  </div>
);

const PageNotFound = props => {
  console.log('PageNotFound: props', props);
  return (
    <NotFound {...props}>Do you get lost?</NotFound>
  );
}

export default class App extends Component {
  toggleMenu = () => {
    document.getElementsByClassName('mask')[0].classList.toggle('isActive');
    document.getElementsByClassName('menu')[0].classList.toggle('isActive');
    document.getElementsByClassName('app-context')[0].classList.toggle('isActive');
    document.getElementsByClassName('btnMenu')[0].classList.toggle('isActive');
    document.getElementsByTagName('body')[0].classList.toggle('hasActiveMenu');
  };

  // A button to open the menu
  MenuButton = (
    <div className='btnMenu' onClick={this.toggleMenu} title='menu'>
      <i className="material-icons">menu</i>
    </div>
  );

  render() {
    return ( 
      <div className="App">
        {this.MenuButton}
        <div className='mask' onClick={this.toggleMenu}></div>
        <Menu onNavLinkClick={this.toggleMenu} />
        
        <div className='app-context'>
          {Header}
          <div>
            <Switch>
              <Route exact path='(/|/latest)' component={LatestGallery} />
              <Route exact path='/trends' component={TrendsGallery} />
              <Route exact path='/samples' component={SampleGallery} />
              <Route exact path='/about' component={About} />
              <Route path='/posts' component={PostDisplayer} />
              <Route component={PageNotFound} />
            </Switch> 
          </div>
        </div>
      </div>
    );
  }
}
