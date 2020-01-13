import React, { useState } from 'react';
import { Grid, Button, makeStyles, TextField, IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { EnhancedEditor } from 'components';
import { API } from 'helpers/index';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}))

export const Example = () => {

  const handleSubmission = (event) => {
    let formData = new FormData();
    formData.append('imageFile', event.target.files[0])
    API.uploadImage(formData, setImageURL);
  }

  const handlePublish = () => {
    API.createNews({
      title: title,
      content: contentStorage,
      category: category.toUpperCase(),
      imageURL: imageURL,
      link: link
    })
  }
  const classes = useStyles();
  const [contentStorage, setContentStorage] = useState('');
  const [imageURL, setImageURL] = useState('https://s3.au-syd.cloud-object-storage.appdomain.cloud/ipan-v2-bucket/image/profilePicture/original/Profile_p6ShcttnsmkW.png');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [link, setLink] = useState('');
  let content = (
    <div className={classes.root}>
      <Grid container spacing={2} justify='flex-start' alignItems='flex-start'>
        <Grid item xs={'auto'} xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'}>
          <TextField variant="outlined" label="Title" margin="normal" required fullWidth id="title" name="title" autoFocus onChange={(e) => setTitle(e.target.value)} />
          <EnhancedEditor id={'textEditor'} getContent={(content) => setContentStorage(content)} />
          <TextField variant="outlined" label="Category" margin="normal" required fullWidth name="Category" id="Category" onChange={(e) => setCategory(e.target.value)} />
          <TextField variant="outlined" label="Link" margin="normal" fullWidth name="Link" id="Link" onChange={(e) => setLink(e.target.value)} />
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            multiple
            onChange={handleSubmission}
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Button variant="contained" color="primary" onClick={handlePublish} className={classes.buttons} >Publish</Button>
        </Grid>
      </Grid>
    </div>);
  return content;
};
