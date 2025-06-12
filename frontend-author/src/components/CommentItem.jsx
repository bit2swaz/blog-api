import React from 'react';
import {
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Divider,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

const CommentItem = ({ comment, level = 0, onDelete, formatDate }) => {
  const maxLevel = 3; // Maximum nesting level to prevent excessive indentation
  const currentLevel = level > maxLevel ? maxLevel : level;
  
  return (
    <>
      <Paper 
        elevation={1} 
        sx={{ 
          mb: 2, 
          ml: currentLevel * 4, // Indent based on nesting level
          bgcolor: currentLevel % 2 === 0 ? 'background.paper' : 'action.hover',
          borderLeft: currentLevel > 0 ? '3px solid' : 'none',
          borderColor: 'primary.main'
        }}
      >
        <ListItem
          alignItems="flex-start"
          secondaryAction={
            <Tooltip title="Delete">
              <IconButton 
                edge="end" 
                color="error" 
                onClick={() => onDelete(comment)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          }
        >
          <ListItemText
            primary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {comment.user?.name || 'Anonymous'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(comment.createdAt)}
                </Typography>
              </Box>
            }
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                  sx={{ display: 'inline', mt: 1, whiteSpace: 'pre-wrap' }}
                >
                  {comment.content}
                </Typography>
                
                {comment.postTitle && (
                  <Box mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      On post: {comment.postTitle}
                    </Typography>
                  </Box>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                  <Box mt={1} display="flex" alignItems="center">
                    <CommentIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="caption" color="primary">
                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </Typography>
                  </Box>
                )}
              </>
            }
          />
        </ListItem>
      </Paper>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        comment.replies.map(reply => (
          <CommentItem
            key={reply.id}
            comment={reply}
            level={level + 1}
            onDelete={onDelete}
            formatDate={formatDate}
          />
        ))
      )}
    </>
  );
};

export default CommentItem; 