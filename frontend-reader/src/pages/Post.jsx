import { useParams } from 'react-router-dom';
import './Post.css';

function Post() {
  const { id } = useParams();

  return (
    <div className="post-page">
      <h1>Post Details</h1>
      <p className="post-id">Post ID: {id}</p>
      <div className="post-content">
        <p>Post content will be displayed here</p>
      </div>
      <div className="comments-section">
        <h2>Comments</h2>
        <p>Comments will be displayed here</p>
      </div>
    </div>
  );
}

export default Post; 