import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';


export const ConfirmationDailog = (props) => {

  const { isOpen, setIsOpen } = props;
  const [cancelButtonName, setCancelButtonName] = useState('Cancel');
  const [submitButtonName, setSubmitButtonName] = useState('OK');

  const radioGroupRef = React.useRef(null);

  useEffect(() => {
    if (props.cancelButtonName) {
      setCancelButtonName(props.cancelButtonName);
    }
    if (props.submitButtonName) {
      setSubmitButtonName(props.submitButtonName);
    }
  }, [props.cancelButtonName, props.submitButtonName]);

  const handleEntering = () => {
    if (radioGroupRef.current !== null) {
      radioGroupRef.current.focus();
    }
  };

  let dailog = (
    <Dialog
      onEntering={handleEntering}
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={isOpen}
    >
      <DialogTitle >{props.title}</DialogTitle>
      <DialogContent>
        {props.message}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={(e) => {
          if (setIsOpen instanceof Function)
            setIsOpen(false);
          if (props.onCancel instanceof Function)
            props.onCancel(e);
        }} color="primary">
          {cancelButtonName}
        </Button>
        <Button onClick={(e) => {
          if (props.onSubmit instanceof Function)
            props.onSubmit(e);
        }} color="primary">
          {submitButtonName}
        </Button>
      </DialogActions>
    </Dialog >
  );
  return dailog;
};


