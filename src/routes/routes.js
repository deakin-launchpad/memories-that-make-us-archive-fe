/***
 *  Created by Sanchit Dang
 ***/
import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoginContext } from 'contexts';
import { Login, Register, Home, MobileMenu, FourOFour, Example, VideoStories, VideoManagerScreen, MemoryWalk } from 'views';
import { Layout } from '../layout';
import { LayoutConfig } from 'configurations';
import { LoadingScreen } from 'components';

export const AppRoutes = (props) => {
  const { loginStatus } = useContext(LoginContext);
  let landingPage = (LayoutConfig.landingPage !== undefined ? LayoutConfig.landingPage !== '' ? LayoutConfig.landingPage : '/home' : '/home');
  if (loginStatus === undefined) return <LoadingScreen />;
  return (
    <Switch>
      <Route exact path='/' render={() => (((!loginStatus) ? <Redirect to={{ pathname: '/login' }} {...props} /> : <Redirect to={{
        pathname: landingPage
      }} {...props} />))} />

      <Route exact path='/login' render={() => ((!loginStatus ? <Login  {...props} /> : <Redirect to={{ pathname: landingPage }} {...props} />))} />
      <Route exact path='/register' render={() => ((!loginStatus ? <Register {...props} /> : <Redirect to={{ pathname: landingPage }} {...props} />))} />

      <Route exact path='/home' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }} {...props} /> : <Layout><Home {...props} /></Layout>))} />
      <Route exact path='/menu' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <MobileMenu  {...props} /></Layout>))} />
      <Route exact path='/examples' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <Example  {...props} /></Layout>))} />
      <Route exact path='/videoStories' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <VideoStories  {...props} /></Layout>))} />
      <Route exact path='/videoManager' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <VideoManagerScreen  {...props} /></Layout>))} />
      <Route exact path='/memoryWalk' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <MemoryWalk  {...props} /></Layout>))} />
      <Route render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout><FourOFour  {...props} /></Layout>))} />
    </Switch >
  );
};

/**
 * Changelog 26/09/2019 - Sanchit Dang
 * - use loginStatus variable instead of stateVariable
 * - <Layout/> has to be used alongside every inner view
 * - removed use of trigger404 function
 */
