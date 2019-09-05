/***
 *  Created by Nirav Bhimani
 *  Contributors : Sanchit Dang *12/08/19*
 ***/

import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Icon, makeStyles } from '@material-ui/core';
import { LayoutConfig } from 'configurations';
import { API } from 'helpers';
import { LayoutContext } from 'contexts';


const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: '0',
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export const BottomNavToolbar = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { setPageTitle } = useContext(LayoutContext);
  let menuButtonLabel = (LayoutConfig.menuButtonLabel !== undefined ?
    LayoutConfig.menuButtonLabel !== '' ? LayoutConfig.menuButtonLabel : 'menu'
    : 'menu');
  useEffect(() => {
    let counter = 0;
    LayoutConfig.menuItems.forEach(value => {
      if (value.isFavourite) {
        if (window.location.pathname === value.controller) {
          setValue(counter);
        }
        counter++;
      }
    });
    if (window.location.pathname === '/menu') {
      setValue(counter + 1);
    }
  }, []);
  const renderIcons = () => {
    return LayoutConfig.menuItems.map((item, key) => {
      if (item.isFavourite) {
        if (item.type === 'logout')
          return <BottomNavigationAction onClick={() => { API.logoutUser(); }} label={item.name} icon={<Icon>{item.icon}</Icon>} key={key} />;
        return <BottomNavigationAction onClick={() => { setPageTitle(item.customTitle ? item.customTitle : item.name); }} component={Link} to={item.controller} label={item.name} icon={<Icon>{item.icon}</Icon>} key={key} />;
      } return null;
    }
    );
  };

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      className={classes.root}
    >
      {renderIcons()}
      {LayoutConfig.displayMobileMenuHam ? <BottomNavigationAction onClick={() => { setPageTitle(menuButtonLabel); }} component={Link} to={'/menu'} label={menuButtonLabel} icon={<Icon>menu</Icon>} /> : null}
    </BottomNavigation>
  );
};

