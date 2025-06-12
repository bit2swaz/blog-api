import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import Layout from '../components/Layout';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Grid
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Fetch posts by the logged-in author
      const response = await axiosInstance.get('/posts/my-posts');
      setPosts(response.data.data.posts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axiosInstance.delete(`/posts/${postId}`);
        // Remove the deleted post from the state
        setPosts(posts.filter(post => post.id !== postId));
        toast.success('Post deleted successfully');
      } catch (err) {
        console.error('Failed to delete post:', err);
        toast.error(err.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  const handleTogglePublish = async (postId, currentStatus) => {
    try {
      if (currentStatus) {
        // If currently published, unpublish it
        await axiosInstance.patch(`/posts/${postId}/unpublish`);
        toast.success('Post unpublished successfully');
      } else {
        // If currently unpublished, publish it
        await axiosInstance.patch(`/posts/${postId}/publish`);
        toast.success('Post published successfully');
      }
      
      // Update the post status in the state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, published: !post.published };
        }
        return post;
      }));
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
      toast.error(err.response?.data?.message || 'Failed to update publish status');
    }
  };

  const handleCreatePost = () => {
    navigate('/new-post');
  };

  const handleViewComments = () => {
    navigate('/comments');
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
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
      <Grid container spacing={2} alignItems="center" mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Posts
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<CommentIcon />}
            onClick={handleViewComments}
          >
            Manage Comments
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
          >
            Create New Post
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {posts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">You haven't created any posts yet.</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
            sx={{ mt: 2 }}
          >
            Create Your First Post
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>
                    <Chip 
                      label={post.published ? 'Published' : 'Draft'} 
                      color={post.published ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEdit(post.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(post.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={post.published ? 'Unpublish' : 'Publish'}>
                        <IconButton 
                          color={post.published ? 'warning' : 'success'} 
                          onClick={() => handleTogglePublish(post.id, post.published)}
                        >
                          {post.published ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
};

export default Dashboard; 