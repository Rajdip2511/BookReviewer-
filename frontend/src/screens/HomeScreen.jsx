import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetBooksQuery, useGetBooksByTitleQuery } from '../slices/apiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './HomeScreen.css';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: allBooksData, isLoading: allBooksLoading } = useGetBooksQuery();
  const { data: searchBooksData, isLoading: searchLoading, error: searchError } = useGetBooksByTitleQuery(searchQuery, {
    skip: !searchQuery,
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim());
      setHasSearched(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const displayBooks = hasSearched ? searchBooksData?.books || [] : allBooksData?.books || [];
  const isLoading = hasSearched ? searchLoading : allBooksLoading;

  // Show modal if searched but no books found
  const shouldShowModal = hasSearched && searchBooksData && (!searchBooksData.books || searchBooksData.books.length === 0);

  if (shouldShowModal && !showModal) {
    setShowModal(true);
  }

  if (isLoading) return <Loader />;

  return (
    <Container fluid className="home-screen">
      <Row className="justify-content-center text-center mb-5">
        <Col md={8} lg={6}>
          <h1 className="display-4 mb-4">Book Search</h1>
          <InputGroup size="lg" className="search-input">
            <Form.Control
              type="text"
              placeholder="Search for a book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-field"
            />
            <Button variant="primary" onClick={handleSearch} className="search-button">
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {hasSearched && (
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Alert variant="info" className="text-center">
              {displayBooks.length > 0 
                ? `Found ${displayBooks.length} book(s) matching "${searchQuery}"`
                : `No books found for "${searchQuery}"`
              }
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center">
        <Col md={10}>
          <Row>
            {displayBooks.length > 0 ? (
              displayBooks.map((book) => (
                <Col key={book.isbn} sm={12} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="book-card h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="book-title">{book.title}</Card.Title>
                      <Card.Text className="book-author text-muted">by {book.author}</Card.Text>
                      <Card.Text className="book-reviews">
                        Reviews: {Object.keys(book.reviews || {}).length}
                      </Card.Text>
                      <div className="mt-auto">
                        <Button 
                          as={Link} 
                          to={`/book/${book.isbn}`} 
                          variant="primary" 
                          className="w-100"
                        >
                          View Details & Reviews
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : !hasSearched ? (
              <Col className="text-center">
                <p className="lead text-muted">Enter a book title in the search box above to find books</p>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>

      {/* Modal for no books found */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Not Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>We're sorry, but the book "{searchQuery}" is currently unavailable in our collection.</p>
          <p>Please try searching for a different title or check back later.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false);
            setSearchTerm('');
            setSearchQuery('');
            setHasSearched(false);
          }}>
            Search Again
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HomeScreen; 