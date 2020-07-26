import React, { useContext, useEffect } from 'react';
import PropTypes from "prop-types";
import { UploadManagerContext } from "contexts";
import { Grid, Card, CardMedia, CardActions, Button, Divider, CardHeader } from "@material-ui/core";
import { API } from "helpers";
import { notify } from "components";
import { LoadingScreen } from 'components/common/Loading';

const MediaCard = props => {
  const { link, type, isUploaded, id, setMedia, resolution, thumb } = props;

  const renderMedia = () => {
    if (!isUploaded) {
      return <center style={{ textAlign: "center" }}>
        <LoadingScreen />
      </center>;
    }
    switch (String(type).toLowerCase()) {
    case "audio": return <CardMedia component="audio" src={link} />;
    case "video": return <CardMedia component="video" controls >
      <source src={link} type="video/mp4" />
    </CardMedia>;
    case "image": return <CardMedia component="img" src={link} />;
    default: return null;
    }
  };

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader subheader={"Resolution : " + resolution + "p"} />
      <Divider />
      {
        renderMedia()
      }
      <CardActions>
        {props.onSelect && <Button size="small" color="primary" onClick={() => {
          props.onSelect({ link, type, isUploaded, resolution, thumb });
        }}>
          Select
        </Button>}
        <Button size="small" color="secondary" onClick={() => {
          API.deleteVideo(id, () => {
            API.getMediaFiles((response) => {
              setMedia(response);
            });
          });
        }}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

MediaCard.propTypes = {
  link: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["VIDEO", "video", "AUDIO", "audio", "image", "IMAGE"]).isRequired,
  isUploaded: PropTypes.bool.isRequired,
  setMedia: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  resolution: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  thumb: PropTypes.string
};


export const VideoManager = props => {
  const { media, setMedia, updateMedia } = useContext(UploadManagerContext);
  useEffect(() => {
    updateMedia();
  }, [updateMedia]);
  let videoManager = (<><Grid container style={{ padding: "10px", position: "sticky", top: props.top === undefined ? "56px" : props.top, background: "white", zIndex: 99 }} spacing={1}>
    <Grid item xs={6}>
      <Button variant="outlined" fullWidth onClick={() => {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', "video/*");
        input.onchange = (e) => {
          if (e.target.files[0] !== undefined) if (e.target.files[0] !== null) {
            let formData = new FormData();
            formData.append('videoFile', e.target.files[0]);
            API.uploadLargeVideo(formData, () => {
              updateMedia();
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
      }
      }>
        Upload
      </Button>
    </Grid><Grid item xs={6}>
      <Button fullWidth variant="outlined" onClick={() => {
        setMedia(undefined);
        updateMedia();
      }}>
        Refresh
      </Button>
    </Grid>
  </Grid>{media === undefined ? <LoadingScreen /> : media.length > 0 ? <Grid container style={{ padding: "10px" }} spacing={1}>
    {media.map((m, i) => <Grid key={"item_" + i} item xs={12} sm={12} lg={4} md={4} xl={4}>
      <MediaCard link={m.link} type={m.type} isUploaded={m.isUploaded} id={m._id} setMedia={setMedia} resolution={m.resolution} onSelect={props.onSelect} thumb={m.thumb} />
    </Grid>)}
  </Grid> : <div style={{ textAlign: "center", paddingTop: "30px" }}> No Media Avaialble</div>}
  </>);
  return videoManager;
};

VideoManager.propTypes = {
  onSelect: PropTypes.func,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
