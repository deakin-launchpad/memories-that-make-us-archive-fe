import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from "prop-types";
import { Container, Card, CardHeader, CardContent, Grid, Typography, IconButton, Menu, MenuItem, TextField, Button, InputAdornment } from "@material-ui/core";
import { API, TextHelper } from "helpers";
import { LoadingScreen, EnhancedModal, VideoManager } from 'components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { notify } from 'components/index';
import moment from "moment-timezone";



const CreateMemoryCard = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [date, setDate] = useState("");

  const [videoManagerIsOpen, setVideoManagerIsOpen] = useState(false);

  const throwError = (message) => {
    props.setCreateModalIsOpen(false);
    notify(message);
  };

  let modalContent = (<Grid style={{ paddingTop: "10px" }} container spacing={1}>
    <EnhancedModal isOpen={videoManagerIsOpen}
      dialogTitle="Video Manager"
      dialogContent={<VideoManager top={0} onSelect={(videoData) => {
        setVideoManagerIsOpen(false);
        setUrl(videoData.link);
      }} />}
      options={{
        disableSubmit: true,
        onClose: () => {
          setVideoManagerIsOpen(false);
        },
        closeButtonName: "Close"
      }} />

    <Grid item xs={12}>
      <TextField required label="Title" fullWidth={true} variant="outlined" defaultValue={title} value={title} onChange={(e) => {
        setTitle(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField required label="Date" fullWidth={true} variant="outlined" defaultValue={date} value={date} placeholder="Date (MM/DD/YYYY)" onChange={(e) => {
        setDate(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField required label="Description" multiline fullWidth={true} variant="outlined" defaultValue={description} value={description} onChange={(e) => {
        setDescription(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField label="Content" multiline fullWidth={true} variant="outlined" defaultValue={content} value={content} onChange={(e) => {
        setContent(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField label="Url" fullWidth={true} variant="outlined" defaultValue={url} value={url} onChange={(e) => {
        setUrl(e.target.value);
      }} InputProps={{
        endAdornment: <InputAdornment position="end" onClick={() => {
          setVideoManagerIsOpen(true);
        }}>
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            color='primary'
          >
            <i className="material-icons">publish</i>
          </IconButton>
        </InputAdornment>
      }} />
    </Grid>

  </Grid>);

  return (<EnhancedModal isOpen={props.createModalIsOpen} dialogTitle="Create Memory Walk" dialogContent={modalContent} options={{
    onSubmit: () => {
      let dataToSend = {};
      if (title === "")
        return throwError("Title Missing");
      else dataToSend.title = title;
      if (description === "")
        return throwError("Description Missing");
      else dataToSend.description = description;
      if (date === "")
        return throwError("Date Missing");
      else if (!moment(date).isValid)
        return throwError("Invalid Date"); dataToSend.date = date;
      if (content !== "")
        dataToSend.content = content;
      if (url !== "")
        dataToSend.url = url;
      API.createMemoryWalk(dataToSend, (response) => {
        if (response.error) props.setCreateModalIsOpen(false);
        props.getMemoryWalks();
        props.setCreateModalIsOpen(false);
      });
    },
    submitButtonName: "Create",
    onClose: () => {
      props.setCreateModalIsOpen(false);
    },
    closeButtonName: "Close"
  }} />);
};

CreateMemoryCard.propTypes = {
  setCreateModalIsOpen: PropTypes.func.isRequired,
  createModalIsOpen: PropTypes.bool.isRequired,
  getMemoryWalks: PropTypes.func.isRequired
};

const MemoryWalkCard = (props) => {

  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [content, setContent] = useState(props.content);
  const [url, setUrl] = useState(props.url);
  const [date, setDate] = useState(props.date);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [videoManagerIsOpen, setVideoManagerIsOpen] = useState(false);

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  let modalContent = (<Grid style={{ paddingTop: "10px" }} container spacing={1}>
    <Grid item xs={12}>
      <TextField required label="Title" fullWidth={true} variant="outlined" defaultValue={title} value={title} onChange={(e) => {
        setTitle(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField required label="Date" fullWidth={true} variant="outlined" defaultValue={TextHelper.formatTime(date)} value={TextHelper.formatTime(date)} placeholder="Date (DD/MM/YYYY)" onChange={(e) => {
        setDate(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField multiline required label="Description" fullWidth={true} variant="outlined" defaultValue={description} value={description} onChange={(e) => {
        setDescription(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField label="Content" fullWidth={true} variant="outlined" defaultValue={props.content} value={content} onChange={(e) => {
        setContent(e.target.value);
      }} />
    </Grid>
    <Grid item xs={12}>
      <TextField label="Url" fullWidth={true} variant="outlined" defaultValue={url} value={url} onChange={(e) => {
        setUrl(e.target.value);
      }} InputProps={{
        endAdornment: <InputAdornment position="end" onClick={() => {
          setVideoManagerIsOpen(true);
        }}>
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            color='primary'
          >
            <i className="material-icons">publish</i>
          </IconButton>
        </InputAdornment>
      }} />
    </Grid>

  </Grid>);

  let menu = (<Menu
    id="memory-walk-menu"
    anchorEl={menuAnchor}
    keepMounted
    open={Boolean(menuAnchor)}
    onClose={closeMenu}
  >
    <MenuItem onClick={(e) => {
      setEditModalIsOpen(true);
      closeMenu(e);
    }}>Edit</MenuItem>
    <MenuItem style={{ color: "red" }} onClick={() => {
      props.memoryWalkUndefined();
      API.deleteMemoryWalk(props.id, () => {
        props.getMemoryWalks();
      });
    }}>Delete</MenuItem>
  </Menu>);

  const throwError = (message) => {
    setEditModalIsOpen(false);
    notify(message);
  };

  let card = (
    <Card style={{ width: "100%", height: "100%" }}>
      {menu}
      <EnhancedModal isOpen={videoManagerIsOpen}
        dialogTitle="Video Manager"
        dialogContent={<VideoManager top={0} onSelect={(videoData) => {
          setVideoManagerIsOpen(false);
          setUrl(videoData.link);
        }} />}
        options={{
          disableSubmit: true,
          onClose: () => {
            setVideoManagerIsOpen(false);
          },
          closeButtonName: "Close"
        }} />
      <EnhancedModal isOpen={editModalIsOpen} dialogTitle="Edit" dialogContent={modalContent} options={{
        onSubmit: () => {
          let dataToSend = {};
          if (title === "")
            return throwError("Title Missing");
          else dataToSend.title = title;
          if (description === "")
            return throwError("Description Missing");
          else dataToSend.description = description;
          if (date === "")
            return throwError("Date Missing");
          else if (!moment(date).isValid)
            return throwError("Invalid Date"); dataToSend.date = date;
          if (content !== "")
            dataToSend.content = content;
          if (url !== "")
            dataToSend.url = url;
          API.updateMemoryWalk({ id: props.id, data: dataToSend }, (response) => {
            if (response.error) setEditModalIsOpen(false);
            setEditModalIsOpen(false);
            props.getMemoryWalks();
          });
        },
        submitButtonName: "Save",
        onClose: () => {
          setEditModalIsOpen(false);
        },
        closeButtonName: "Close"
      }} />
      <CardHeader title={TextHelper.titleCase(props.title)}
        subheader={<Typography variant="subtitle1"><strong>Date:</strong> {TextHelper.formatTime(props.date)}</Typography>}
        action={<IconButton onClick={(e) => {
          handleMenuClick(e);
        }} aria-label="settings">
          <MoreVertIcon />
        </IconButton>}
      />
      <CardContent>
        <Grid container spacing={1}>
          {props.description && <Grid item xs={12}>
            <strong>Description:</strong> {props.description}
          </Grid>}
          {props.content && < Grid item xs={12}>
            <strong>Content:</strong> {props.content}
          </Grid>}
          {props.url && < Grid item xs={12}>
            <strong>Url:</strong> {props.url}
          </Grid>}
        </Grid>
      </CardContent>
    </Card >
  );
  return card;
};

export const MemoryWalk = () => {
  const [memoryWalks, setMemoryWalks] = useState();

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  const getMemoryWalks = useCallback(() => {
    API.getMemoryWalks((response) => {
      setMemoryWalks(response);
    });
  }, []);

  useEffect(() => {
    getMemoryWalks();
  }, [getMemoryWalks]);
  if (memoryWalks === undefined) return <LoadingScreen />;
  let view = (
    <Container style={{ paddingTop: "28px" }}>
      <CreateMemoryCard createModalIsOpen={createModalIsOpen} setCreateModalIsOpen={setCreateModalIsOpen} getMemoryWalks={getMemoryWalks} />

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={() => {
            setCreateModalIsOpen(true);
          }}>
            Create
          </Button>

        </Grid>
        {
          memoryWalks.map((item, i) => <Grid item xs={12} sm={12} lg={4} md={4} xl={4} key={"memory_" + i}>
            <MemoryWalkCard
              title={item.title}
              description={item.description}
              date={item.date}
              id={item._id}
              content={item.content}
              url={item.url}
              getMemoryWalks={getMemoryWalks}
              memoryWalkUndefined={() => {
                setMemoryWalks(undefined);
              }}
            />
          </Grid>)
        }
      </Grid>
    </Container>
  );
  return view;
};

