import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Layout from '../components/Layout';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  List,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import CommentItem from '../components/CommentItem';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/comments/my-posts');
      
      // Organize comments into a hierarchical structure
      const commentMap = {};
      const rootComments = [];
      
      // First pass: create a map of all comments
      response.data.data.comments.forEach(comment => {
        comment.replies = [];
        commentMap[comment.id] = comment;
      });
      
      // Second pass: organize into parent-child relationships
      response.data.data.comments.forEach(comment => {
        if (comment.parentId) {
          // This is a reply, add it to its parent's replies
          if (commentMap[comment.parentId]) {
            commentMap[comment.parentId].replies.push(comment);
          } else {
            // If parent doesn't exist, treat as root comment
            rootComments.push(comment);
          }
        } else {
          // This is a root comment
          rootComments.push(comment);
        }
      });
      
      setComments(rootComments);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    
    try {
      await axiosInstance.delete(`/comments/${commentToDelete.id}`);
      toast.success('Comment deleted successfully');
      
      // Refresh comments list
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
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
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Comments on Your Posts
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

        {comments.length === 0 ? (
          <Alert severity="info">
            No comments have been made on your posts yet.
          </Alert>
        ) : (
          <List>
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                level={0}
                onDelete={handleDeleteClick}
                formatDate={formatDate}
              />
            ))}
          </List>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
            {commentToDelete?.replies?.length > 0 && 
              " All replies to this comment will also be deleted."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Comments; 