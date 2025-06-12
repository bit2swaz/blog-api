import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.posts.getAll();
        setPosts(response.data.posts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Blog</h1>
      <p>Discover the latest articles and insights</p>
      
      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : posts.length === 0 ? (
        <div className="no-posts">No posts available at the moment.</div>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-meta">
                <span className="post-author">By {post.author.name}</span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
              <p className="post-excerpt">
                {post.content.substring(0, 150)}
                {post.content.length > 150 ? '...' : ''}
              </p>
              <Link to={`/post/${post.id}`} className="read-more-link">
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home; 