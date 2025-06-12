import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import axiosInstance from '../services/axiosInstance';
import Layout from './Layout';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PostForm = ({ postId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(postId ? true : false);
  const navigate = useNavigate();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      tags: '',
      content: ''
    }
  });

  // Fetch post data if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setInitializing(true);
        const response = await axiosInstance.get(`/posts/${postId}`);
        const post = response.data.data.post;
        
        // Set form values
        setValue('title', post.title);
        setValue('content', post.content);
        setValue('tags', post.tags ? post.tags.join(', ') : '');
        
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Failed to load post data. Please try again later.');
      } finally {
        setInitializing(false);
      }
    };

    fetchPost();
  }, [postId, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Process tags
      const tags = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      const payload = {
        title: data.title,
        content: data.content,
        tags
      };
      
      if (postId) {
        // Update existing post
        await axiosInstance.put(`/posts/${postId}`, payload);
      } else {
        // Create new post
        await axiosInstance.post('/posts', payload);
      }
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Failed to save post:', err);
      setError(err.response?.data?.message || 'Failed to save post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            {postId ? 'Edit Post' : 'Create New Post'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Post Title"
                    fullWidth
                    variant="outlined"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tags (comma-separated)"
                    fullWidth
                    variant="outlined"
                    placeholder="tech, programming, react"
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Content
              </Typography>
              <Controller
                name="content"
                control={control}
                rules={{ required: 'Content is required' }}
                render={({ field }) => (
                  <>
                    <Editor
                      apiKey="your-tinymce-api-key" // You can use a free API key from TinyMCE
                      value={field.value}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar:
                          'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help'
                      }}
                      disabled={loading}
                    />
                    {errors.content && (
                      <Typography color="error" variant="caption">
                        {errors.content.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : (postId ? 'Update Post' : 'Create Post')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Layout>
  );
};

export default PostForm; 