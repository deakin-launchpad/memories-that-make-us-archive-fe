import React, { useEffect, useContext, useState } from 'react';
import { Grid, Typography, makeStyles, Card, CardActionArea, CardMedia, CardActions, CardContent, Button, TextField, MenuItem, Slider, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';
import { HeaderElements } from 'components';
import { LayoutContext } from 'contexts';
import { API } from 'helpers/index';
// import { EnhancedDrawer } from 'components';

const useStyles = makeStyles({
  card: {
    // maxWidth: 30,
    maxHeight: 450,
    width: '100%',
    height: '100%',
    margin: 16,
    position: 'relative',
    overflow: 'auto'
  },
  media: {
    height: 140,
  },
  cardButton: {
    position: 'relative',
    // top: 450,
    bottom: 2,
    // top: theme.spacing.unit * 2
  },
});

export const Home = () => {
  const classes = useStyles();
  const { setHeaderElements, pageTitle } = useContext(LayoutContext);
  const [articles, setArticles] = useState();
  const [categories, setCategories] = useState(['All']);
  const [category, setCategory] = useState('');
  const [numberOfRecords, setNumberOfRecords] = useState(10);
  const [open, setOpen] = React.useState(false);
  // const [bottomDrawerStatus, setBottomDrawerStatus] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState('');
  const [search, setSearch] = useState('');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  // const [drawerContent, setDrawerContent] = useState('');
  useEffect(() => {
    if (category === 'All') {
      setCategory('');
    }
    if (currentPageNumber === '') {
      API.getNews({ category: category, numberOfRecords: numberOfRecords, currentPageNumber: 1 }, setArticles);
    }
    else {
      API.getNews({ category: category, numberOfRecords: numberOfRecords, currentPageNumber: currentPageNumber }, setArticles);
    }
  }, [category, numberOfRecords, currentPageNumber]);

  useEffect(() => {
    if (search !== '') {
      if (currentPageNumber === '') {
        API.getNewsBySearch({ title: search, numberOfRecords: numberOfRecords, currentPageNumber: 1 }, setArticles);
      }
      else {
        API.getNewsBySearch({ title: search, numberOfRecords: numberOfRecords, currentPageNumber: currentPageNumber }, setArticles);
      }
    }
    else {
      if (category === 'All') {
        setCategory('');
      }
      if (currentPageNumber === '') {
        API.getNews({ category: category, numberOfRecords: numberOfRecords, currentPageNumber: 1 }, setArticles);
      }
      else {
        API.getNews({ category: category, numberOfRecords: numberOfRecords, currentPageNumber: currentPageNumber }, setArticles);
      }
    }
  }, [search, category, numberOfRecords, currentPageNumber]);
  const handleClickOpen = (data) => {
    setSelectedNewsId(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    API.deleteNews(selectedNewsId);
    setOpen(false);
  };

  useEffect(() => {
    API.getCategories(handleCategory);
  }, []);

  const handleCategory = (data) => {
    let temp = ['All'];
    data.forEach(element => {
      temp.push(element);
    });
    setCategories(temp);
  };
  function valuetext(value) {
    setNumberOfRecords(value);
    return `${value}`;
  }

  // function handleContent(data) {
  //   setDrawerContent(<Typography variant="body2" color="textSecondary" component="p" dangerouslySetInnerHTML={{ __html: data }}>
  //   </Typography>);
  //   setBottomDrawerStatus(true);
  // }
  const handleChange = event => {
    setCategory(event.target.value);
  };
  useEffect(() => {
    setHeaderElements(<HeaderElements>
      <Typography>
        {pageTitle}
      </Typography>
    </HeaderElements>);
  }, [pageTitle, setHeaderElements]);
  return (
    <Grid container justify='flex-start' direction='row' alignItems="stretch" style={{ marginTop: 20, marginRight: 20 }}>
      <Grid item xs={12} xl={12} lg={12} md={12} sm={12} style={{ marginLeft: 10 }} >
        <Typography variant="h4">News Feed</Typography>
      </Grid>
      <Grid container spacing={5}>
        <Grid item xs={'auto'} xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} style={{ marginLeft: 10 }} >
          <TextField
            id="standard-select-category"
            select
            label="Select"
            value={category}
            onChange={handleChange}
            helperText="Select a category"
          >
            {categories.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={'auto'} xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'}>
          <Typography id="discrete-slider" gutterBottom>
            Select Top results
          </Typography>
          <Slider
            defaultValue={10}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={5}
            max={100}
          />
        </Grid>
        <Grid item xs={'auto'} xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'}>
          <TextField
            id='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search...'
            variant='outlined'
          >
          </TextField>
        </Grid>
        <Grid item xs={'auto'} xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'}>
          <TextField
            id='page'
            value={currentPageNumber}
            onChange={(e) => setCurrentPageNumber(e.target.value)}
            placeholder='Pagenumber'
            variant='outlined'
            helperText="Page Number"
          >
          </TextField>
        </Grid>
      </Grid>
      <Grid container justify='flex-start' direction='row' spacing={2}>
        {articles != null && articles.map((article, i) => (
          <Grid item xs={12} xl={3} lg={5} md={4} sm={5} key={i} >
            <Card className={classes.card}>
              <CardActionArea >
                <CardMedia
                  className={classes.media}
                  image={article.imageURL}
                  title={article.title}
                />
                {/* <EnhancedDrawer
                  anchor={'bottom'}
                  title={article.title}
                  content={drawerContent}
                  isOpen={bottomDrawerStatus}
                  onClose={() => { setBottomDrawerStatus(false); }} /> */}
                <CardContent >
                  <Typography gutterBottom variant="h6" component="h4">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" dangerouslySetInnerHTML={{ __html: article.content }} >
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.cardButton}>
                {article.link === '' ? null :
                  <a target="_blank" href={article.link.substring(0, 8) === 'https://' ? article.link : 'https://' + article.link} rel="noopener noreferrer">
                    <Button size="small" color="primary"  >
                      Learn More
                    </Button>
                  </a>
                }
                {/* <Fab color="primary" size="small" aria-label="add" className={classes.margin}>
                  <EditIcon />
                </Fab> */}
                <IconButton aria-label="delete" color='primary' style={{ position: 'relative' }} onClick={() => handleClickOpen(article._id)}>
                  <DeleteIcon />
                </IconButton>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="draggable-dialog-title"
                >
                  <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Delete
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this news
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
