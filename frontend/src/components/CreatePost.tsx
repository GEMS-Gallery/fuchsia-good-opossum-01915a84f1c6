import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

interface BlogPostForm {
  title: string;
  content: string;
}

function CreatePost() {
  const { control, handleSubmit } = useForm<BlogPostForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: BlogPostForm) => {
    try {
      const result = await backend.createBlogPost({
        title: data.title,
        content: data.content,
      });

      if ('ok' in result) {
        alert('Blog post created successfully!');
        navigate(`/post/${result.ok}`);
      } else {
        alert('Failed to create blog post: ' + result.err);
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('An error occurred while creating the blog post.');
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Blog Post
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="content"
          control={control}
          defaultValue=""
          rules={{ required: 'Content is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Content"
              fullWidth
              multiline
              rows={10}
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Create Post
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
