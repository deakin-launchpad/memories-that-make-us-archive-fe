import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { LoginContext } from 'contexts';
import { API } from "helpers";

export const UploadManagerContext = createContext();

export const UploadManagerProvider = props => {
  const { children } = props;
  const { loginStatus } = useContext(LoginContext);
  const [media, setMedia] = useState();
  const updateMedia = useCallback(() => {
    API.getMediaFiles((response) => {
      setMedia(response);
    });
  }, []);

  useEffect(() => {
    if (loginStatus)
      updateMedia();
  }, [loginStatus, updateMedia]);


  return <UploadManagerContext.Provider value={{ media, setMedia, updateMedia }}>{children}</UploadManagerContext.Provider>;
};

UploadManagerProvider.propTypes = {
  children: PropTypes.node
};