const express = require('express');
const cors = require('cors');

const app = express();

// cors is used to make frontend and backend interact
app.use(cors());
// express is used to allow the server to understand json data from react
app.use(express.json());

// empty database
let libraryBooks = [];

// GET method puts all books to frontend
app.get('/api/books', (req, res) => {
  res.json(libraryBooks);
});

// POST method adds books to the datasbase
app.post('/api/books', (req, res) => {
  // this makes it possible to add new book to the database
  const newBook = {
    id: Date.now(), // to make unique id
    title: req.body.title,
    borrower: req.body.borrower,
    dueDate: req.body.dueDate,
    isReturned: false 
  };
  
  // push to array and send it back to frontend
  libraryBooks.push(newBook);
  res.json(newBook);
});

// PUT method updates whether the book is returned or not
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  
  // this finds the book user want to change
  const bookIndex = libraryBooks.findIndex(book => book.id === bookId);
  
  if (bookIndex !== -1) {
    // reverses the boolean status to show borrowed or returned
    libraryBooks[bookIndex].isReturned = !libraryBooks[bookIndex].isReturned;
    res.json(libraryBooks[bookIndex]);
  }
});

// DELETE method remove book from system
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  // filter out the book user wants delete
  libraryBooks = libraryBooks.filter(book => book.id !== bookId);
  res.json({ message: "Book is deleted" });
});

// server gets started on port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
