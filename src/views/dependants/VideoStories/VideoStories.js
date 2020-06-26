import React, { useEffect, useState } from 'react';
import { API } from "helpers";
import { Container, Card, CardHeader, CardContent, IconButton, Grid, Menu, MenuItem, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, ListSubheader, Typography, Button } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { LoadingScreen, EnhancedModal, notify } from 'components';
import Plyr from 'react-plyr';

const VideoStoryCard = ({ storyId, title, description, thumbnail, videos }) => {

  const [titleForTextFeild, setTitle] = useState();
  const [descriptionForTextFeild, setDescription] = useState();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editVideosIsOpen, setEditVideosIsOpen] = useState(false);

  const [preparedSources, setPreparedSources] = useState();
  const [qualaties, setQualaties] = useState([]);


  useEffect(() => {
    setTitle(title);
    setDescription(description);
  }, [title, description, thumbnail]);

  useEffect(() => {
    if (videos !== undefined) {
      let temp = [];
      let qualaties = [];
      videos.forEach(video => {
        qualaties.push(Number(video.width));
        temp.push({
          src: video.link,
          size: Number(video.width),
          type: "video/mp4"
        });
      });
      setQualaties(qualaties);
      setPreparedSources(temp);
    }
  }, [videos]);

  const handleClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  let editVideoContent = (<Grid container spacing={1}>
    <Grid item xs={12}>
      <TextField label="Title" fullWidth={true} variant="outlined" defaultValue={titleForTextFeild} value={titleForTextFeild} onChange={(e) => {
        setTitle(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField label="Description" fullWidth={true} variant="outlined" defaultValue={descriptionForTextFeild} value={descriptionForTextFeild} onChange={(e) => {
        setDescription(e.target.value);
      }} />
    </Grid>
  </Grid>);



  let manageVideoContent = (<Container>
    <List dense={true}>
      <ListSubheader />
      {
        videos.map(video => {
          return <ListItem key={Math.random()} alignItems="flex-start">
            <ListItemText primary={`Quality : ${video.width}`} secondary={video.link} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => { }}
              ><i className="material-icons" style={{ color: "red" }}>delete</i></IconButton>
            </ListItemSecondaryAction>
          </ListItem>;
        })
      }
    </List>
  </Container>);

  const saveVideo = () => {
    let dataToSend = {
      storyId,
      data: {
        title: titleForTextFeild,
        description: descriptionForTextFeild
      }
    };
  };

  if (videos === undefined) return <LoadingScreen />;
  let content = (<div>
    <EnhancedModal isOpen={editModalIsOpen}
      dialogTitle="Edit Video Story"
      dialogContent={editVideoContent}
      options={{
        onSubmit: () => {
          saveVideo();
          setEditModalIsOpen(false);
        },
        onClose: () => {
          setEditModalIsOpen(false);
        }
      }} />
    <EnhancedModal isOpen={editVideosIsOpen}
      dialogTitle={<Grid container justify="space-around">
        <Grid item xs={10}>
          <Typography component="span" variant="h6">Manage Videos</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', "video/*");
            input.onchange = (e) => {
              if (e.target.files[0] !== undefined) if (e.target.files[0] !== null) {
                let formData = new FormData();
                formData.append('videoFile', e.target.files[0]);
                API.uploadVideo(formData, (videoLink, thumbnail, size) => {
                  let dataToSend = {
                    storyId, data: {
                      link: videoLink,
                      thumb: thumbnail,
                      width: size.toString()
                    }
                  };
                  API.addVideoToExistingVideoStory(dataToSend, (response) => {
                    if (response) {
                      let textToNotify = "File Uploaded Successfuly";
                      notify(textToNotify, { timeout: 3000 });
                    }
                  });
                }, {
                  onUploadProgress: (progressPercent) => {
                    if (progressPercent === 100) {
                      let textToNotify = "Video is being processed at the server";
                      notify(textToNotify, { timeout: null });
                    } else {
                      let textToNotify = "Uploading video to server: " + progressPercent;
                      notify(textToNotify, { timeout: null });
                    }
                  },
                });
              }
            };
            input.click();
          }}>
            {"Add Video"}
          </Button>
        </Grid>

      </Grid>}
      dialogContent={manageVideoContent}
      options={{
        onClose: () => {
          setEditVideosIsOpen(false);
        }
      }} />
    <Menu
      id="simple-menu"
      anchorEl={menuAnchor}
      keepMounted
      open={Boolean(menuAnchor)}
      onClose={handleClose}
    >
      <MenuItem onClick={(e) => {
        setEditModalIsOpen(true);
        handleClose(e);
      }}>Edit</MenuItem>
      <MenuItem onClick={(e) => {
        setEditVideosIsOpen(true);
        handleClose(e);
      }}>Manage Videos</MenuItem>
      <MenuItem onClick={handleClose}>Delete</MenuItem>

    </Menu>
    <Card>
      <CardHeader title={title} action={
        <IconButton onClick={(e) => {
          handleClick(e);
        }} aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      } />
      <CardContent>
        {description}
        <Plyr
          type="video"
          poster={thumbnail}
          sources={preparedSources}
          title={title}
          quality={{
            default: qualaties[qualaties.length - 1],
            options: qualaties
          }}
        />
      </CardContent>
    </Card >
  </div>
  );
  return content;
};

export const VideoStories = () => {
  const [stories, setStories] = useState();
  useEffect(() => {
    API.getVideoStories((response) => {
      setStories(response);
    });
  }, []);
  if (stories === undefined) return <LoadingScreen />;
  let content = (<Container style={{ margin: "10px" }} >
    <Grid container spacing={1}>
      {
        stories.map((story, i) => {
          return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={`story_${i}`}>
            <VideoStoryCard storyId={story._id} videos={story.videos} title={story.title} description={story.description} thumbnail={story.thumbnail} />
          </Grid>;
        })
      }
    </Grid>
  </Container>);

  return content;
};
