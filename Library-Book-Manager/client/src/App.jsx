import React, { useState, useEffect } from 'react';
import './App.css'; // import style file

export default function App() {
  // states to save the data in an empty state
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [borrower, setBorrower] = useState('');
  const [dueDate, setDueDate] = useState('');

  // fetch data from backend when page first load
  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.log("error getting books", error));
  }, []);

  // this function run when user submit the form
  const handleAddBook = (e) => {
    e.preventDefault(); // stop page from reloading

    // if user leave inputs empty, stop the function
    if (!title || !borrower || !dueDate) {
      alert("Please fill all fields before submit");
      return;
    }

    const newBookData = { title, borrower, dueDate };

    // send post request to backend
    fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBookData)
    })
      .then(response => response.json())
      .then(savedBook => {
        // update frontend state with new book
        setBooks([...books, savedBook]);
        // clear inputs
        setTitle('');
        setBorrower('');
        setDueDate('');
      });
  };

  // function to mark book returned
  const toggleReturnStatus = (id) => {
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'PUT'
    })
      .then(response => response.json())
      .then(updatedBook => {
        // map array and replace old book status with updated book status
        setBooks(books.map(book => book.id === id ? updatedBook : book));
      });
  };

  // function to delete book
  const deleteBook = (id) => {
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'DELETE'
    }).then(() => {
      // filter out from frontend list
      setBooks(books.filter(book => book.id !== id));
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Library Book Manager</h1>
        <p>Keep track of borrowed books and due dates</p>
      </header>

      <div className="main-content">
        {/* Form section for add book */}
        <div className="form-card">
          <h2>Borrow New Book</h2>
          <form onSubmit={handleAddBook}>
            <div className="input-group">
              <label>Book Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Name of book" 
              />
            </div>
            
            <div className="input-group">
              <label>Borrower Name</label>
              <input 
                type="text" 
                value={borrower} 
                onChange={(e) => setBorrower(e.target.value)} 
                placeholder="Who borrowed it" 
              />
            </div>

            <div className="input-group">
              <label>Due Date</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
              />
            </div>

            <button type="submit" className="submit-btn">Add Book</button>
          </form>
        </div>

        {/* List section to show books */}
        <div className="list-card">
          <h2>Borrowed Books ({books.length})</h2>
          
          {books.length === 0 ? (
            <p className="empty-msg">No books borrowed right now.</p>
          ) : (
            <div className="books-grid">
              {books.map((book) => (
                <div key={book.id} className={`book-item ${book.isReturned ? 'returned' : ''}`}>
                  
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p><strong>Borrower:</strong> {book.borrower}</p>
                    <p><strong>Due:</strong> {book.dueDate}</p>
                    <span className={`status-badge ${book.isReturned ? 'badge-green' : 'badge-orange'}`}>
                      {book.isReturned ? 'Returned' : 'Borrowed'}
                    </span>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      onClick={() => toggleReturnStatus(book.id)} 
                      className="return-btn">
                      {book.isReturned ? 'Undo Return' : 'Mark Return'}
                    </button>
                    <button 
                      onClick={() => deleteBook(book.id)} 
                      className="delete-btn">
                      Delete
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
