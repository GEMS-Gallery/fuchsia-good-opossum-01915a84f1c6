import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { backend } from 'declarations/backend';
import { Principal } from '@dfinity/principal';

interface BlogPost {
  id: bigint;
  authorId: Principal;
  title: string;
  content: string;
  createdAt: bigint;
  updatedAt: bigint | null;
}

function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await backend.getAllBlogPosts();
        setPosts(result);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Recent Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id.toString()}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  By: <Link to={`/profile/${post.authorId.toText()}`}>{post.authorId.toText()}</Link>
                </Typography>
                <Typography variant="body2" component="p">
                  {post.content.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/post/${post.id}`}>
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
