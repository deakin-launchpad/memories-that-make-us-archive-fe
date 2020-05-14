import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { CreatePost } from "./HelpingFunctions";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  input: {
    display: "none"
  }
}));

export const Example = () => {

  const classes = useStyles();
  let content = (
    <div className={classes.root}>
      <Grid container spacing={2} justify='flex-start' alignItems='flex-start'>
        <Grid item xs={12} xl={12} lg={12} md={12} sm={12}>
          <CreatePost />
        </Grid>
      </Grid>
    </div>);
  return content;
};
