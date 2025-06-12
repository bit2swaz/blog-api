import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Post.css';

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        // Fetch post details
        const postResponse = await api.posts.getById(id);
        setPost(postResponse.data.post);

        // Fetch comments
        const commentsResponse = await api.comments.getByPostId(id);
        setComments(commentsResponse.data.comments);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch post data:', err);
        setError('Failed to load post. Please try again later.');
        showError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id, showError]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim() || !isAuthenticated) return;
    
    try {
      setSubmitting(true);
      
      const payload = {
        content: commentText,
        ...(replyingTo && { parentId: replyingTo })
      };
      
      const response = await api.comments.create(id, payload);
      
      if (replyingTo) {
        // Find the parent comment and add the reply
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data.comment]
              };
            }
            return comment;
          });
        });
        showSuccess('Reply added successfully!');
      } else {
        // Add the new comment to the list
        setComments(prevComments => [...prevComments, response.data.comment]);
        showSuccess('Comment added successfully!');
      }
      
      // Reset form
      setCommentText('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to submit comment:', err);
      showError('Failed to submit your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    // Scroll to the comment form
    document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Render a comment and its replies
  const renderComment = (comment) => {
    return (
      <div key={comment.id} className="comment">
        <div className="comment-header">
          <span className="comment-author">{comment.author.name}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-actions">
          {isAuthenticated && (
            <button 
              className="reply-button" 
              onClick={() => handleReplyClick(comment.id)}
            >
              Reply
            </button>
          )}
        </div>
        
        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map(reply => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="post-page">
      <article className="post-content">
        <h1>{post.title}</h1>
        
        <div className="post-meta">
          <span className="post-author">By {post.author.name}</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div 
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>
        
        {comments.length > 0 ? (
          <div className="comments-list">
            {comments.map(comment => renderComment(comment))}
          </div>
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
        
        {isAuthenticated ? (
          <div className="comment-form-container">
            <h3 id="comment-form">
              {replyingTo ? 'Reply to comment' : 'Leave a comment'}
            </h3>
            
            {replyingTo && (
              <div className="replying-to">
                <p>Replying to comment</p>
                <button className="cancel-reply" onClick={cancelReply}>
                  Cancel reply
                </button>
              </div>
            )}
            
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Writing as ${user?.name || 'Anonymous'}...`}
                required
              />
              <button 
                type="submit" 
                className="submit-comment" 
                disabled={submitting || !commentText.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>
          </div>
        ) : (
          <div className="login-prompt">
            <p>Please log in to leave a comment.</p>
            <Link to="/login" className="login-link">Log in</Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Post; 