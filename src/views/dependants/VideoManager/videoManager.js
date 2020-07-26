import React from 'react';
import { VideoManager } from "components";
import { Container } from "@material-ui/core";


export const VideoManagerScreen = () => {

  let manager = (
    <Container style={{ paddingTop: "10px" }}>
      <VideoManager />
    </Container>
  );
  return manager;
};

