import React, { useEffect, useState } from 'react';
import { API } from "helpers";
import { Container, Card, CardHeader, CardContent, IconButton, Grid, Menu, MenuItem, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, ListSubheader, Typography, Button } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { LoadingScreen, EnhancedModal, notify } from 'components';

const VideoStoryCard = ({ storyId, title, description, thumbnail, videos, reloadData }) => {

  const [internalVideos, setInternalVideos] = useState();
  const [titleForTextFeild, setTitle] = useState();
  const [descriptionForTextFeild, setDescription] = useState();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editVideosIsOpen, setEditVideosIsOpen] = useState(false);


  useEffect(() => {
    setTitle(title);
    setDescription(description);
  }, [title, description, thumbnail]);

  useEffect(() => {
    if (videos !== undefined) {
      setInternalVideos(videos);
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
        internalVideos !== undefined ? (internalVideos.length > 0 ? internalVideos.map(video => {
          return <ListItem key={Math.random()} alignItems="flex-start">
            <ListItemText primary={`Quality : ${video.width}`} secondary={video.link} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  setInternalVideos([]);
                  let data = {
                    storyId,
                    videoId: video._id
                  };
                  API.deleteVideoFromExistingVideoStory(data, (response) => {
                    if (response) {
                      notify("Deleted");
                      let temp = internalVideos.filter(videoX => videoX._id !== video._id);
                      setInternalVideos(temp);
                    }
                  });
                }}
              ><i className="material-icons" style={{ color: "red" }}>delete</i></IconButton>
            </ListItemSecondaryAction>
          </ListItem>;
        }) : null) : <LoadingScreen />
      }
    </List>
  </Container >);

  const saveVideo = () => {
    let dataToSend = {
      storyId,
      data: {
        title: titleForTextFeild,
        description: descriptionForTextFeild
      }
    };
    API.editVideoStory(dataToSend, (response) => {
      if (response) {
        notify("Updated");
        reloadData();
      }
    });
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
        },
        submitButtonName: "Save",
        closeButtonName: "Cancel"
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
                      if (response.videos !== undefined)
                        setInternalVideos(response.videos);
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
          reloadData();
        },
        disableSubmit: true,
        disableClose: true
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
      <MenuItem onClick={(e) => {
        API.deleteVideoStory(storyId, () => {
          handleClose(e);
          reloadData();
        });
      }}>Delete</MenuItem>

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
        {
          //TODO: Replace with a proper player or add resolution switcher with a select tag for resolution
          internalVideos !== undefined && internalVideos.length > 0 ? <><br /><video controls >
            {
              internalVideos.map((source, i) =>
                <source src={source.link} type="video/mp4" key={storyId + "_source_" + i} />
              )
            }
          Your browser does not support the video tag.
          </video></>
            : <center> <br /><Button onClick={() => {
              setEditVideosIsOpen(true);
            }}>Add Videos</Button></center>}
      </CardContent>
    </Card >
  </div>
  );
  return content;
};

export const VideoStories = () => {
  const [stories, setStories] = useState();

  const [titleForTextFeild, setTitle] = useState();
  const [descriptionForTextFeild, setDescription] = useState();

  const [creationModalIsOpen, setCreationModalIsOpen] = useState(false);


  useEffect(() => {
    API.getVideoStories((response) => {
      setStories(response);
    });
  }, []);

  const reloadData = () => {
    API.getVideoStories((response) => {
      setStories(response);
    });
  };

  const createStory = () => {
    let data = {
      title: titleForTextFeild,
      description: descriptionForTextFeild
    };
    API.createVideoStory(data, (response) => {
      if (response) {
        notify("Created");
        reloadData();
      }
    });
  };

  let createVideoContent = (<Grid container spacing={1}>
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

  if (stories === undefined) return <LoadingScreen />;
  let content = (<Container style={{ margin: "10px" }} >
    <EnhancedModal isOpen={creationModalIsOpen}
      dialogTitle="Create Video Story"
      dialogContent={createVideoContent}
      options={{
        onSubmit: () => {
          createStory();
          setCreationModalIsOpen(false);
        },
        onClose: () => {
          setCreationModalIsOpen(false);
        },
        submitButtonName: "Create"
      }} />
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Button onClick={() => {
          setCreationModalIsOpen(true);
        }
        }>Create Video Story</Button>
      </Grid>
      {
        stories.map((story, i) => {
          return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={`story_${i}`}>
            <VideoStoryCard reloadData={reloadData} storyId={story._id} videos={story.videos} title={story.title} description={story.description} thumbnail={story.thumbnail} />
          </Grid>;
        })
      }
    </Grid>
  </Container>);

  return content;
};
