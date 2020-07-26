import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { API } from "helpers";

export const UploadManagerContext = createContext();

export const UploadManagerProvider = props => {
  const { children } = props;
  const [media, setMedia] = useState();
  useEffect(() => {
    API.getMediaFiles((response) => { 
      setMedia(response);
    });
  }, []);


  return <UploadManagerContext.Provider value={{ media, setMedia }}>{children}</UploadManagerContext.Provider>;
};

UploadManagerProvider.propTypes = {
  children: PropTypes.node
};