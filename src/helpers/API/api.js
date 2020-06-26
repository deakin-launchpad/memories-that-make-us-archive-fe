import { AccessToken, logout } from 'contexts/helpers';
import { notify } from 'components';
import { axiosInstance } from '../index';
/**
 *  @errorHelper :  Function to return error StatusText.
 */
const errorHelper = (error, variant) => {
  if (error.response === undefined) {
    notify("Network Error");
    logout();
    return false;
  }
  if (error.response.statusCode === 401) {
    if (variant === "login")
      return notify("Invalid Credentials");
    notify("You may have been logged out");
    logout();
    return false;
  }
  if (error.response.data.statusCode === 401) {
    if (variant === "login")
      return notify("Invalid Credentials");
    notify("You may have been logged out");
    logout();
    return false;
  }
  if (error.response.status === 401) {
    if (variant === "login")
      return notify("Invalid Credentials");
    notify("You may have been logged out");
    logout();
    return false;
  }
  if (error.response.data.message !== "") {
    notify(error.response.data.message);
    return false;
  }
  if (error.response.statusText !== "") {
    notify(error.response.statusText);
    return false;
  }
};

const performCallback = (callback, data) => {
  if (callback instanceof Function) {
    if (data !== undefined)
      return callback(data);
    callback();
  }
};

class API {
  displayAccessToken = () => {
    console.log(AccessToken);
  }

  login = (data, callback) => {
    axiosInstance.post('admin/login', data).then(response => {
      return callback(response.data.data.accessToken, true);
    }).catch(error => {
      errorHelper(error, "login");
    });
  }

  accessTokenLogin = (callback) => {
    axiosInstance.post('admin/accessTokenLogin', {}, {
      headers: {
        authorization: "Bearer " + AccessToken
      }
    }).then(() => performCallback(callback, AccessToken)).catch(error => errorHelper(error));
  }

  logoutUser = (callback) => {
    logout();
    performCallback(callback);
  }

  createNews = (data) => {
    axiosInstance.post('/memory/createMemory', data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(() => {
      notify("News Published");
      window.location.reload();
    }).catch(error => {
      errorHelper(error);
    });
  }

  getNews = (data, callback) => {
    axiosInstance.post('/memory/getMemories', data, {
    }).then(response => {
      return callback(response.data.data.data);
    }).catch(error => {
      errorHelper(error);
    });
  }

  getNewsBySearch = (data, callback) => {
    axiosInstance.post('/news/searchByKeyword', data, {
    }).then(response => {
      return callback(response.data.data.data);
    }).catch(error => {
      errorHelper(error);
    });
  }

  uploadImage = (data, callback, { onUploadProgress }) => {
    axiosInstance.post('/upload/uploadImage', data, {
      timeout: Number.POSITIVE_INFINITY,
      headers: {
        authorization: 'Bearer ' + AccessToken
      },
      onUploadProgress: (progressEvent) => onUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))

    }).then(response => {
      return callback(response.data.data.imageFileURL.original);
    }).catch(error => {
      errorHelper(error);
    });
  }

  uploadVideo = (data, callback, { onUploadProgress }) => {
    axiosInstance.post('/upload/uploadVideo', data, {
      timeout: Number.POSITIVE_INFINITY,
      headers: {
        authorization: 'Bearer ' + AccessToken
      },
      onUploadProgress: (progressEvent) => onUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
    }).then(response => {
      let uploadedVideoLink = response.data.data.videoFileURL.uploadedVideo;
      let uploadedVideoThumbnail = response.data.data.videoFileURL.thumbnail;
      let width = response.data.data.videoFileURL.metadata.maxWidth;
      return callback(uploadedVideoLink, uploadedVideoThumbnail, width);
    }).catch(error => {
      errorHelper(error);
    });
  }

  uploadAudio = (data, callback, { onUploadProgress }) => {
    axiosInstance.post('/upload/uploadAudio', data, {
      timeout: Number.POSITIVE_INFINITY,
      headers: {
        authorization: 'Bearer ' + AccessToken
      },
      onUploadProgress: (progressEvent) => onUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
    }).then(response => {
      return callback(response.data.data.audioFile.original);
    }).catch(error => {
      errorHelper(error);
    });
  }

  getVideoStories = (callback) => {
    axiosInstance.get('/videoStories/getVideoStories ', {
    }).then(response => {
      callback(response.data.data.stories);
    }).catch(error => {
      errorHelper(error);
    });
  }

  editVideoStory = (data, callback) => {
    axiosInstance.put(`videoStories/updateVideoStory/${data.storyId}`, data.data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(() => {
      callback(true);
    }).catch(error => errorHelper(error));
  }

  createVideoStory = (data, callback) => {
    axiosInstance.post(`videoStories/createVideoStory`, data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(() => {
      callback(true);
    }).catch(error => errorHelper(error));
  }

  deleteVideoStory = (storyId, callback) => {
    axiosInstance.delete(`videoStories/deleteVideoStory/${storyId}`, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(() => {
      callback(true);
    }).catch(error => errorHelper(error));
  }

  addVideoToExistingVideoStory = (data, callback) => {
    axiosInstance.put(`videoStories/${data.storyId}/addVideoToExisting`, data.data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(() => {
      callback(true);
    }).catch(error => errorHelper(error));
  }

  deleteVideoFromExistingVideoStory = (data, callback) => {
    axiosInstance.delete(`videoStories/${data.storyId}/deleteVideoFromExisting/${data.videoId}`, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(() => {
      callback(true);
    }).catch(error => errorHelper(error));
  }


  getCategories = (callback) => {
    axiosInstance.get('/memory/getRegions ', {
    }).then(response => {
      return callback(response.data.data.data);
    }).catch(error => {
      errorHelper(error);
    });
  }

  deleteNews = (data) => {
    axiosInstance.delete('/news/deleteNews/' + data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      },
    }).then(() => {
      notify("News Deleted");
      window.location.reload();
    }).catch(error => {
      errorHelper(error);
    });
  }

}
const instance = new API();
export default instance;
