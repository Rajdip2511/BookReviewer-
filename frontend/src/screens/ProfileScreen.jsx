import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { setCredentials } from '../slices/authSlice';
import {
  useUpdateUserMutation,
  useGetUserReviewsQuery,
  useDeleteReviewMutation,
} from '../slices/apiSlice';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const {
    data: reviews,
    isLoading: loadingReviews,
    error: errorReviews,
    refetch: refetchReviews
  } = useGetUserReviewsQuery();

  const [deleteReview] = useDeleteReviewMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          username,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        setMessage('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setMessage(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (isbn) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(isbn);
        refetchReviews();
      } catch (err) {
        setMessage(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      {/* Navigation Button */}
      <div className="mb-3">
        <Button 
          as={Link} 
          to="/" 
          variant="outline-primary" 
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          Back to Book Search
        </Button>
      </div>

      <Row>
        <Col md={3}>
          <h2>User Profile</h2>

          {message && <Message variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Message>}

          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
            {loadingUpdate && <Loader />}
          </Form>
        </Col>

        <Col md={9}>
          <h2>My Reviews</h2>
          {loadingReviews ? (
            <Loader />
          ) : errorReviews ? (
            <Message variant="danger">
              {errorReviews?.data?.message || errorReviews.error}
            </Message>
          ) : reviews?.length === 0 ? (
            <Message>You haven't written any reviews yet.</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reviews?.map((review) => (
                  <tr key={review._id}>
                    <td>
                      <LinkContainer to={`/book/${review.book._id}`}>
                        <Button variant="link">{review.book.title}</Button>
                      </LinkContainer>
                    </td>
                    <td>{review.rating}</td>
                    <td>{review.comment}</td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(review.book._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen; 