import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import {
  Card, CardHeader, Avatar, CardActions, CardContent, Typography, Grid, Button, Divider, TextField, InputAdornment, IconButton, Box, InputLabel,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from '@material-ui/core';
import { Image, notify, ConfirmationDailog, EnhancedEditor, VideoManager, EnhancedModal } from 'components';
import { TextHelper, API } from 'helpers';
import ThumbUpAlt from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import { red, green, indigo, blue, teal, deepOrange, purple, lightBlue, lightGreen, orange, blueGrey } from '@material-ui/core/colors';

var checkFileExtension = function (fileName) {
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
};

const validateExtension = (fileName, type) => {
  const VALID_FILE_EXTENSIONS = {
    VIDEO: ["mp4", "avi", "mov", "wmv", "webm"],
    AUDIO: ["mp3", "ogg", "wav"],
    DOCS: [],
    IMAGE: ["png", "jpeg", "jpg"]
  };
  switch (type.toLowerCase()) {
  case "video": return VALID_FILE_EXTENSIONS.VIDEO.includes(checkFileExtension(fileName));
  case "audio": return VALID_FILE_EXTENSIONS.AUDIO.includes(checkFileExtension(fileName));
  case "image": return VALID_FILE_EXTENSIONS.IMAGE.includes(checkFileExtension(fileName));
  default: return false;
  }
};

const uploadMedia = (files, callback) => {
  let fileName = files[0].name;
  let formData = new FormData();
  let type = files[0].type.split("/").shift();
  switch (type) {
  case "image":
    if (!validateExtension(fileName, "image")) return notify("Unsupported File Selected");
    formData.append('imageFile', files[0]);
    API.uploadImage(formData, (imageLink) => {
      callback(imageLink, { type: "image" });
      let textToNotify = "File Uploaded Successfuly";
      notify(textToNotify, { timeout: 3000 });
    }, {
      onUploadProgress: (progressPercent) => {
        if (progressPercent === 100) {
          let textToNotify = "Image is being processed at the server";
          notify(textToNotify, { timeout: 99999 * 99999 });
        } else {
          let textToNotify = "Uploading image to server: " + progressPercent;
          notify(textToNotify, { timeout: 99999 * 99999 });
        }
      },
    });
    break;
  case "video":
    if (!validateExtension(fileName, "video")) return notify("Unsupported File Selected");
    formData.append('videoFile', files[0]);
    API.uploadVideo(formData, (videoLink, thumbnail) => {
      callback(videoLink, { poster: thumbnail, type: "video" });
      let textToNotify = "File Uploaded Successfuly";
      notify(textToNotify, { timeout: 3000 });
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
    break;
  case "audio":
    if (!validateExtension(fileName, "audio")) return notify("Unsupported File Selected");
    formData.append('audioFile', files[0]);
    API.uploadAudio(formData, (audioLink) => {
      if (audioLink !== undefined) {
        callback(audioLink, { type: "audio" });
        let textToNotify = "File Uploaded Successfuly";
        notify(textToNotify, { timeout: 3000 });
      }
    }, {
      onUploadProgress: (progressPercent) => {
        if (progressPercent === 100) {
          let textToNotify = "Audio is being processed at the server";
          notify(textToNotify, { timeout: null });
        } else {
          let textToNotify = "Uploading audio to server: " + progressPercent;
          notify(textToNotify, { timeout: null });
        }
      }
    });
    break;
  default: return notify("invalid file selected");
  }
};


export const CreatePost = (props) => {
  const [postData, setPostData] = useState("");
  const [categories, setCategories] = useState("");
  const [date, setDate] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState('');
  const [imageLocalLink, setLocalLink] = useState('');
  const [uname, setUname] = useState();
  const [content, setContent] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [videoManagerIsOpen, setVideoManagerIsOpen] = useState(false);

  useEffect(() => {
    let arr = String(props.userName).split(' ');
    let arr2 = [];
    arr.forEach((value, i) => {
      if (i < 2)
        arr2.push(value[0]);
    });
    setUname(arr2.join("").toUpperCase());
  }, [props.userName]);


  const resetPoster = () => {
    setPostData('');
    setLocalLink('');
    setContent("");
    setImage('');
  };

  const uploadImage = (files, callback) => {
    if (files) {
      let filesToSend = new FormData();
      filesToSend.append('imageFile', files);
      API.uploadImage(filesToSend, (imageLink) => {
        callback(imageLink);
      });
    } else notify('System Error');
  };

  const uploadPost = () => {

    const prepareDataForSending = (imageLink) => {
      let dataToSend = {
      };
      let cat = [];
      if (postData)
        Object.assign(dataToSend, { title: postData });
      if (date) {
        if (!moment(date).isValid)
          return notify("Invalid Date");
        Object.assign(dataToSend, { date: date });
      }
      if (region)
        Object.assign(dataToSend, { region: region });
      if (content)
        Object.assign(dataToSend, { content: content });
      if (categories) {
        cat = categories.split(",");
        Object.assign(dataToSend, { category: cat });
      }
      if (imageLink)
        Object.assign(dataToSend, {
          media: [{
            "link": imageLink,
            "thumbnail": imageLink,
            "type": "IMAGE",
            "isCover": true
          }]
        });
      if (uploadedMedia) {
        let temp = dataToSend.media;
        if (temp !== undefined)
          dataToSend.media = [...uploadedMedia, ...temp];
      }
      return dataToSend;
    };

    const createNews = (imageLink) => {
      API.createNews(prepareDataForSending(imageLink), () => {
        if (imageLink)
          URL.revokeObjectURL(imageLocalLink);
        resetPoster();
        if (props.reload instanceof Function)
          props.reload();
      });
    };
    if (postData && content) {
      if (image)
        uploadImage(image, (imageLink) => {
          let textToNotify = "Cover image uploded. Now, Creating the post.";
          notify(textToNotify, { timeout: 3000 });
          createNews(imageLink);
        }, {
          onUploadProgress: (progressPercent) => {
            if (progressPercent === 100) {
              let textToNotify = "Coverimage is being processed at the server";
              notify(textToNotify, { timeout: 99999 * 99999 });
            } else {
              let textToNotify = "Uploading cover image to server: " + progressPercent;
              notify(textToNotify, { timeout: 99999 * 99999 });
            }
          }
        });
      else createNews();
    } else if (postData === "") {
      notify("Title is required");
    } else if (content === "") {
      notify("Memory content is required");
    } else notify('Title and Content required');
  };
  return (<Card style={{ width: '100%' }}>
    <EnhancedModal isOpen={videoManagerIsOpen}
      dialogTitle="Video Manager"
      dialogContent={<VideoManager top={0} onSelect={(videoData) => {
        if (!videoData.isUploaded) return notify("Video is still being uploaded");
        setUploadedMedia([...uploadedMedia, {
          link: videoData.link,
          type: "video",
          thumbnail: videoData.thumb,
          isCover: false
        }]);
        setVideoManagerIsOpen(false);
      }} />}
      options={{
        disableSubmit: true,
        onClose: () => {
          setVideoManagerIsOpen(false);
        },
        closeButtonName: "Close"
      }} />
    <CardContent>
      <input type="file" id="fileupload" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => {
        if (e.target.files[0] !== undefined) if (e.target.files[0] !== null) {
          let localUrl = URL.createObjectURL(e.target.files[0]);
          setImage(e.target.files[0]);
          setLocalLink(localUrl);
        }
      }} />
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} md={8}>
          <TextField multiline fullWidth
            value={postData}
            onChange={(e) => { setPostData(e.target.value); }}
            variant={'outlined'}
            placeholder="Memory Title"
            color='primary'
            InputProps={{
              startAdornment: <InputAdornment position='start'>
                <Avatar style={{ margin: '0 auto', backgroundColor: red[500] }}>
                  {props.userImage ? <Image style={{ height: '100%' }} src={props.userImage} /> : uname}
                </Avatar>
              </InputAdornment>,
              endAdornment: !postData && !image ? <InputAdornment position="end" onClick={() => {
                let imageuploadinput = document.getElementById('fileupload');
                imageuploadinput.click();
              }}>
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  color='primary'
                >
                  <i className="material-icons">local_see</i>
                </IconButton>
              </InputAdornment> :
                <>
                  <InputAdornment position="end" onClick={() => {
                    let imageuploadinput = document.getElementById('fileupload');
                    imageuploadinput.click();
                  }}>
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      color='primary'

                    >
                      <i className="material-icons">local_see</i>
                    </IconButton>
                  </InputAdornment>
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      color='secondary'
                      onClick={() => {
                        uploadPost();
                      }}
                    >
                      <i className="material-icons">send</i>
                    </IconButton>
                  </InputAdornment>
                </>,
            }} />
        </Grid>
        {imageLocalLink &&
          <Grid item xs={12} md={8} >
            <Image src={imageLocalLink} />
            <Button onClick={() => {
              URL.revokeObjectURL(imageLocalLink);
              setLocalLink('');
              setImage('');
            }
            }>Remove Image</Button>
          </Grid>
        }
        <Grid item xs={12} md={8}>
          <TextField fullWidth
            value={categories}
            onChange={(e) => { setCategories(e.target.value); }}
            variant={'outlined'}
            placeholder="Categories (seperate by ,)"
            color='primary' />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField fullWidth
            value={date}
            onChange={(e) => { setDate(e.target.value); }}
            variant={'outlined'}
            placeholder="Date (DD/MM/YYYY)"
            hint="09/09/2020"
            color='primary' />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField fullWidth
            value={region}
            onChange={(e) => { setRegion(e.target.value); }}
            variant={'outlined'}
            placeholder="Region"
            color='primary' />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box border={1} style={{ paddingLeft: "10px", paddingRight: "10px", paddingTop: "10px", borderRadius: "10px", paddingBottom: "10px" }}>
            <InputLabel style={{ paddingBottom: "5px" }} >
              Media
            </InputLabel>
            <List dense={true} >
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      var input = document.createElement('input');
                      input.setAttribute('type', 'file');
                      input.setAttribute('accept', "audio/*, image/*");
                      input.onchange = function (e) {
                        uploadMedia(e.target.files, (link, extras) => {
                          switch (extras.type) {
                          case "audio": setUploadedMedia([...uploadedMedia, {
                            link: link,
                            type: "audio"
                          }]);
                            break;
                          case "image": setUploadedMedia([...uploadedMedia, {
                            link: link,
                            type: "image",
                            thumbnail: link,
                            isCover: false
                          }]);
                            break;
                          default: return;
                          }
                        });
                      };
                      input.click();
                    }}>
                    Upload Audio and Images
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setVideoManagerIsOpen(true);

                    }}>
                    Upload Video
                  </Button>
                </Grid>
              </Grid>
              {
                uploadedMedia.map((media, i) => <div key={i + "_media"}>
                  <ListItem>
                    <ListItemText
                      primary={media.link}
                      secondary={TextHelper.titleCase(media.type)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => {
                        setUploadedMedia(uploadedMedia.filter(mediaX => mediaX.link !== media.link));
                      }} edge="end" aria-label="comments">
                        <i className="material-icons">delete</i>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {i < uploadMedia.length && <Divider />}
                </div>)
              }
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box border={1} style={{ paddingLeft: "10px", paddingRight: "10px", paddingTop: "10px", borderRadius: "10px", paddingBottom: "10px" }}>
            <InputLabel style={{ paddingBottom: "5px" }} >
              Memory
            </InputLabel>
            <EnhancedEditor content={content} id={'textEditor'}
              getContent={(content) => setContent(content)}
              imageUpload={{
                fileTypes: "*",
                function: (files, callback) => {
                  uploadMedia(files, callback);
                }
              }} />
          </Box>
        </Grid>

      </Grid>
    </CardContent>
  </Card >);
};

CreatePost.propTypes = {
  userName: PropTypes.string,
  reload: PropTypes.func,
  userImage: PropTypes.string
};

export const giveMeColors = (position) => {
  let colors = [green, indigo, blue, teal, deepOrange, purple, red, lightBlue, lightGreen, orange, blueGrey];
  if (position !== undefined) {
    return colors[position % colors.length][500];
  }
  return colors[Math.floor(Math.random() * colors.length)][500];
};


export const Post = (props) => {
  const [uname, setUname] = useState();
  const [like, setLike] = useState(false);
  const [numComments, setNumComments] = useState();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (props.numComments !== undefined) {
      setNumComments(props.numComments);
    }
  }, [props.numComments]);
  useEffect(() => {
    if (props.like) {
      setLike(props.like);
    }
  }, [props.like]);
  useEffect(() => {
    let arr = String(props.userName).split(' ');
    let arr2 = [];
    arr.forEach((value, i) => {
      if (i < 2)
        arr2.push(value[0]);
    });
    setUname(arr2.join("").toUpperCase());
  }, [props.userName]);

  const likeUnlikePost = () => {
    API.likeUnlikePost({ postId: props._id, like: !props.like }, () => {
      setLike(!like);
    });
  };

  const deletePost = () => {
    API.deletePost({ postId: props._id }, () => {
      if (props.reload instanceof Function)
        props.reload();
    });
  };

  return (<><Card>
    <CardHeader
      title={props.userName ? TextHelper.titleCase(props.userName) : 'User Name'}
      subheader={props.time ? moment(moment.utc(props.time).toDate()).format('D MMMM [at] hh:mm A') : null}
      avatar={<Avatar aria-label='userImage' style={{ backgroundColor: giveMeColors(props.index) }}>
        {props.userImage ? <Image style={{ height: '100%' }} src={props.userImage} /> : uname}
      </Avatar>
      }
      action={
        props.postUserId !== undefined && props.postUserId !== null &&
          props.userId !== undefined && props.userId !== null && props.postUserId === props.userId ? <IconButton onClick={() => setIsOpen(true)}>
            <DeleteIcon />
          </IconButton> : null
      } />
    {
      props.image ? <>
        <CardContent style={{ paddingTop: 0 }}>
          <Typography variant="body2" color="textSecondary" component="span">
            {props.text}
          </Typography>
        </CardContent> <Image
          style={{ width: '100%' }}
          src={props.image}
          alt="imagepost"
        />
      </>
        :
        <CardContent style={{ paddingTop: 0 }}>
          <Typography variant="body1" component="p">
            {props.text}
          </Typography>
        </CardContent>
    }
    <Divider />
    <CardActions style={{ paddingLeft: 20, paddingRight: 20, }}>
      <Grid container direction="row"
        justify="space-evenly"
        alignItems="center">
        <Grid item>
          <Button onClick={() => { likeUnlikePost(); }} size="small" color="primary" startIcon={like ? <ThumbUpAlt /> : <ThumbUpOutlinedIcon />} aria-label="add to favorites">
            Like
          </Button>
        </Grid>
        <Grid item>

          <Button component={Link} to={{
            pathname: '/socialforum/comments',
            post: { ...props, like: like }
          }} size="small" color="primary" startIcon={<ChatBubbleOutlineOutlinedIcon />} aria-label="add to favorites">
            {numComments ? `Comment (${numComments})` : 'Comment'}
          </Button>
        </Grid>
      </Grid>
    </CardActions>

  </Card>  <ConfirmationDailog isOpen={isOpen} title='Delete Post' message='Are you sure you want to delete this post?' submitButtonName='Delete' closeButtonName='Cancel' onSubmit={() => {
    deletePost();
    setIsOpen(false);
  }} onCancel={() => {
    setIsOpen(false);
  }} />
  </>
  );
};

Post.propTypes = {
  numComments: PropTypes.number,
  image: PropTypes.string,
  userName: PropTypes.string,
  reload: PropTypes.func,
  like: PropTypes.bool,
  _id: PropTypes.string,
  time: PropTypes.string,
  userImage: PropTypes.string,
  postUserId: PropTypes.string,
  userId: PropTypes.string,
  index: PropTypes.string,
  text: PropTypes.string
};
