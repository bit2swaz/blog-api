import { useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';

const EditPost = () => {
  const { id } = useParams();
  return <PostForm postId={id} />;
};

export default EditPost; 