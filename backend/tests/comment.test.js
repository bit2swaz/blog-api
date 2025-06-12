const request = require('supertest');
const app = require('../server');
const { setupTestUser, setupTestPost, cleanupDatabase } = require('./setup');

let token;
let user;
let post;
let comment;

// Setup test data before running tests
beforeAll(async () => {
  await cleanupDatabase();
  
  // Create test user and get token
  const testData = await setupTestUser();
  user = testData.user;
  token = testData.token;
  
  // Create test post
  post = await setupTestPost(user.id);
  
  // Publish the post
  await request(app)
    .patch(`/api/posts/${post.id}/publish`)
    .set('Authorization', `Bearer ${token}`);
});

// Clean up after tests
afterAll(async () => {
  await cleanupDatabase();
});

describe('Comment Endpoints', () => {
  describe('POST /api/posts/:postId/comments', () => {
    it('should create a new comment', async () => {
      const res = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is a test comment'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comment).toHaveProperty('id');
      expect(res.body.data.comment).toHaveProperty('content', 'This is a test comment');
      expect(res.body.data.comment).toHaveProperty('authorId', user.id);
      expect(res.body.data.comment).toHaveProperty('postId', post.id);
      
      comment = res.body.data.comment;
    });

    it('should return error if not authenticated', async () => {
      const res = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .send({
          content: 'This should fail'
        });
      
      expect(res.statusCode).toEqual(401);
    });

    it('should create a reply to a comment', async () => {
      const res = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is a reply to the test comment',
          parentId: comment.id
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comment).toHaveProperty('parentId', comment.id);
    });

    it('should return error if post does not exist', async () => {
      const res = await request(app)
        .post('/api/posts/nonexistent-id/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This should fail'
        });
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /api/posts/:postId/comments', () => {
    it('should return all comments for a post with nested replies', async () => {
      const res = await request(app).get(`/api/posts/${post.id}/comments`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comments).toBeInstanceOf(Array);
      expect(res.body.data.comments).toHaveLength(1); // Only top-level comments
      
      // Check that replies are nested
      expect(res.body.data.comments[0].replies).toBeInstanceOf(Array);
      expect(res.body.data.comments[0].replies).toHaveLength(1);
    });

    it('should return empty array if post has no comments', async () => {
      // Create a new post without comments
      const newPost = await setupTestPost(user.id);
      
      const res = await request(app).get(`/api/posts/${newPost.id}/comments`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comments).toBeInstanceOf(Array);
      expect(res.body.data.comments).toHaveLength(0);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/${comment.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(204);
      
      // Verify comment is deleted by checking comments list
      const commentsRes = await request(app).get(`/api/posts/${post.id}/comments`);
      expect(commentsRes.body.data.comments).toHaveLength(0);
    });

    it('should return error if comment does not exist', async () => {
      const res = await request(app)
        .delete('/api/comments/nonexistent-id')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
    });

    it('should return error if not authenticated', async () => {
      // Create a new comment first
      const newCommentRes = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Another test comment'
        });
      
      const newCommentId = newCommentRes.body.data.comment.id;
      
      // Try to delete without authentication
      const res = await request(app)
        .delete(`/api/comments/${newCommentId}`);
      
      expect(res.statusCode).toEqual(401);
    });
  });
}); 