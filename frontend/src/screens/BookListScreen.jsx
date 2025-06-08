import { useState } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  useGetBooksQuery,
  useGetBooksByAuthorQuery,
  useGetBooksByTitleQuery,
  useGetBookByIsbnQuery,
} from '../slices/apiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';

const BookListScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');

  const {
    data: allBooks,
    isLoading: loadingAll,
    error: errorAll,
  } = useGetBooksQuery();

  const {
    data: booksByTitle,
    isLoading: loadingTitle,
    error: errorTitle,
  } = useGetBooksByTitleQuery(searchTerm, {
    skip: !searchTerm || searchType !== 'title',
  });

  const {
    data: booksByAuthor,
    isLoading: loadingAuthor,
    error: errorAuthor,
  } = useGetBooksByAuthorQuery(searchTerm, {
    skip: !searchTerm || searchType !== 'author',
  });

  const {
    data: bookByIsbn,
    isLoading: loadingIsbn,
    error: errorIsbn,
  } = useGetBookByIsbnQuery(searchTerm, {
    skip: !searchTerm || searchType !== 'isbn',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // The queries will automatically run based on the searchTerm and searchType
  };

  const displayBooks = () => {
    if (searchTerm) {
      if (searchType === 'title' && booksByTitle) return booksByTitle;
      if (searchType === 'author' && booksByAuthor) return booksByAuthor;
      if (searchType === 'isbn' && bookByIsbn) return [bookByIsbn];
    }
    return allBooks;
  };

  const isLoading = loadingAll || loadingTitle || loadingAuthor || loadingIsbn;
  const error = errorAll || errorTitle || errorAuthor || errorIsbn;

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Books</h1>
        </Col>
        <Col className="text-end">
          <Form onSubmit={handleSearch} className="d-flex">
            <Form.Control
              type="text"
              name="q"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books..."
              className="mr-sm-2 ml-sm-5"
            ></Form.Control>
            <Form.Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="mx-2"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="isbn">ISBN</option>
            </Form.Select>
            <Button type="submit" variant="outline-success" className="p-2">
              Search
            </Button>
          </Form>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            {displayBooks()?.map((book) => (
              <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
                <Card className="my-3 p-3 rounded">
                  <Link to={`/book/${book._id}`}>
                    <Card.Title as="div" className="product-title">
                      <strong>{book.title}</strong>
                    </Card.Title>
                  </Link>

                  <Card.Text as="div">
                    <div className="my-2">
                      Author: {book.author}
                    </div>
                    <div>
                      ISBN: {book.ISBN}
                    </div>
                    <Rating
                      value={book.averageRating}
                      text={`${book.reviews?.length || 0} reviews`}
                    />
                  </Card.Text>

                  <Card.Text as="h3">${book.price}</Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default BookListScreen; 