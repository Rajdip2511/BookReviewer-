import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge, Alert, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  useGetBookByIsbnQuery,
  useGetBookReviewsQuery,
  useAddReviewMutation,
} from '../slices/apiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './BookScreen.css';

const BookScreen = () => {
  const { id: isbn } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { data: bookData, isLoading: bookLoading, error: bookError } = useGetBookByIsbnQuery(isbn);
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useGetBookReviewsQuery(isbn);
  const [addReview, { isLoading: reviewSubmitting }] = useAddReviewMutation();

  const book = bookData?.book;
  const reviews = reviewsData?.reviews || {};

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      setShowModal(true);
      return;
    }

    try {
      await addReview({
        isbn,
        review: {
          rating: parseInt(rating),
          comment: review,
          user: userInfo.username,
          date: new Date().toISOString().split('T')[0]
        }
      }).unwrap();
      
      setReview('');
      setRating(5);
      refetchReviews();
      alert('Review added successfully!');
    } catch (err) {
      alert('Error adding review: ' + (err?.data?.message || err.message));
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  const calculateAverageRating = () => {
    const reviewKeys = Object.keys(reviews);
    if (reviewKeys.length === 0) return 0;
    
    const totalRating = reviewKeys.reduce((sum, key) => {
      return sum + (reviews[key].rating || 0);
    }, 0);
    
    return (totalRating / reviewKeys.length).toFixed(1);
  };

  if (bookLoading || reviewsLoading) return <Loader />;
  if (bookError) return <Message variant="danger">{bookError?.data?.message || bookError.error}</Message>;
  if (!book) return <Message variant="danger">Book not found</Message>;

  const averageRating = calculateAverageRating();
  const totalReviews = Object.keys(reviews).length;

  return (
    <Container className="book-screen py-4">
      <Row>
        <Col md={8}>
          <Card className="book-detail-card mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Link to="/" className="btn btn-outline-secondary">
                  ← Back to Search
                </Link>
              </div>
              
              <h1 className="book-title">{book.title}</h1>
              <h4 className="book-author text-muted mb-3">by {book.author}</h4>
              
              <div className="rating-summary mb-4">
                <div className="d-flex align-items-center">
                  <div className="stars-display me-3">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="rating-text">
                    {averageRating > 0 ? `${averageRating} out of 5` : 'No ratings yet'}
                  </span>
                  <Badge bg="info" className="ms-2">
                    {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              <div className="book-info">
                <p><strong>ISBN:</strong> {book.isbn}</p>
              </div>
            </Card.Body>
          </Card>

          {/* Reviews Section */}
          <Card className="reviews-card">
            <Card.Header>
              <h5 className="mb-0">Reviews</h5>
            </Card.Header>
            <Card.Body>
              {totalReviews > 0 ? (
                <ListGroup variant="flush">
                  {Object.entries(reviews).map(([key, reviewData]) => (
                    <ListGroup.Item key={key} className="review-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <strong>{reviewData.user || 'Anonymous'}</strong>
                        <div className="d-flex align-items-center">
                          <div className="stars-small me-2">
                            {renderStars(reviewData.rating || 0)}
                          </div>
                          <small className="text-muted">{reviewData.date}</small>
                        </div>
                      </div>
                      <p className="review-comment mb-0">{reviewData.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No reviews yet. Be the first to review this book!</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="review-form-card sticky-top">
            <Card.Header>
              <h5 className="mb-0">Write a Review</h5>
            </Card.Header>
            <Card.Body>
              {userInfo ? (
                <Form onSubmit={handleSubmitReview}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Write your review here..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </Form>
              ) : (
                <Alert variant="info">
                  <p>Please <Link to="/login">sign in</Link> to write a review.</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Login Required Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to be logged in to submit a review.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" as={Link} to="/login">
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookScreen; 