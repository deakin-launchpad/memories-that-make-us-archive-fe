import React from 'react';
import PropTypes from "prop-types";
import { LoginContext, LoginProvider } from './common/LoginContext';
import { LayoutContext, LayoutProvider } from './common/LayoutContext';
import { UploadManagerContext, UploadManagerProvider } from "./dependents/uploadManagerContext";

export {
  LoginContext,
  LoginProvider,
  LayoutContext,
  LayoutProvider,
  UploadManagerContext,
  UploadManagerProvider
};

export const ContextManager = (props) => {
  const { children } = props;
  return (
    <LayoutProvider>
      <LoginProvider>
        <UploadManagerProvider>
          {children}
        </UploadManagerProvider>
      </LoginProvider>
    </LayoutProvider>
  );

};
ContextManager.propTypes = {
  children: PropTypes.node.isRequired
};
