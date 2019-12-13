import React, { useEffect, useContext, useState } from 'react';
import { Grid, Typography, makeStyles, Box, Card, CardActionArea, CardMedia, CardActions, CardContent, Button } from '@material-ui/core';
import { HeaderElements } from 'components';
import { LayoutContext } from 'contexts';
import { API } from 'helpers/index';
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
  card: {
    maxWidth: 330,
    maxHeight: 600,
    height: '100%',
    margin: 16,
  },
  media: {
    height: 140,
  },
});

export const Home = () => {
  const classes = useStyles();
  const { setHeaderElements, pageTitle } = useContext(LayoutContext);
  const [articles, setArticles] = useState();
  useEffect(() => {
    API.getNews({ category: '' }, setArticles);
  }, [])
  useEffect(() => {
    setHeaderElements(<HeaderElements>
      <Typography>
        {pageTitle}
      </Typography>
    </HeaderElements>);
  }, [pageTitle, setHeaderElements]);
  return (
    <Grid container justify='flex-start' direction='column' alignItems="stretch" style={{ marginTop: 20, marginRight: 20 }}>
      <Grid item xs={'auto'} xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} style={{ marginLeft: 10 }} >
        <Typography variant="h4">News Feed</Typography>
      </Grid>
      <Grid container justify='flex-start' direction='row' spacing={2}>
        {articles != null && articles.map((article, i) => (
          <Grid item xs={12} xl={3} lg={5} md={4} sm={5} key={i} >
            <Card className={classes.card} >
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={article.imageURL}
                  title={article.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h4">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" dangerouslySetInnerHTML={{ __html: article.content }}>
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <a target="_blank" href={'https://' + article.link}>
                  <Button size="small" color="primary"  >
                    Learn More
                  </Button>
                </a>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
