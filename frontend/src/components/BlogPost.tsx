import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Paper, Avatar } from '@mui/material';
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

interface UserProfile {
  username: string;
  bio: string | null;
  profilePicture: string | null;
}

function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const result = await backend.getBlogPost(BigInt(id));
          if ('ok' in result) {
            setPost(result.ok);
            fetchAuthor(result.ok.authorId);
          } else {
            console.error('Error fetching post:', result.err);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      }
    };

    fetchPost();
  }, [id]);

  const fetchAuthor = async (authorId: Principal) => {
    try {
      const result = await backend.getUserProfile(authorId);
      if ('ok' in result) {
        setAuthor(result.ok);
      } else {
        console.error('Error fetching author:', result.err);
      }
    } catch (error) {
      console.error('Error fetching author:', error);
    }
  };

  if (!post) {
    return <Typography>Loading post...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {post.title}
      </Typography>
      {author && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <Avatar
            src={author.profilePicture || undefined}
            alt={author.username}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography variant="subtitle1">
            By: <Link to={`/profile/${post.authorId.toText()}`}>{author.username}</Link>
          </Typography>
        </div>
      )}
      <Typography variant="body1" paragraph>
        {post.content}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Created: {new Date(Number(post.createdAt) / 1000000).toLocaleString()}
        {post.updatedAt && (
          <> | Updated: {new Date(Number(post.updatedAt) / 1000000).toLocaleString()}</>
        )}
      </Typography>
    </Paper>
  );
}

export default BlogPost;
