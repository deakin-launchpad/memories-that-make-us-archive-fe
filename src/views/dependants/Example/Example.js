import React from 'react';
import { Container } from '@material-ui/core';
import { CreatePost } from "./HelpingFunctions";


export const Example = () => {

  let content = (
    <Container style={{ paddingTop: "10px" }}>
      <CreatePost />
    </Container>);
  return content;
};
