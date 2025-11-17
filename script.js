// A simple class to represent a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        // Use ISBN as a unique identifier for simplicity
        this.isbn = isbn;
    }
}

// === STORAGE FUNCTIONS (Simulating a database with localStorage) ===
class Storage {
    static getBooks() {
        let books;
        // Get books from localStorage, or initialize as an empty array
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            // localStorage stores strings, so we must parse it back into an object
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);
        // Stringify the array before saving it back to localStorage
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Storage.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1); // Remove the book at this index
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// === UI FUNCTIONS (Handles DOM manipulation) ===
class UI {
    static displayBooks() {
        const books = Storage.getBooks();
        books.forEach((book) => UI.addBookToList(book));
        UI.toggleNoBooksMessage();
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list tbody');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button class="delete">X</button></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(target) {
        if(target.classList.contains('delete')) {
            // The ISBN is in the 3rd (index 2) cell of the parent row
            const isbn = target.parentElement.previousElementSibling.textContent;

            // Remove from UI (parent's parent is the <tr>)
            target.parentElement.parentElement.remove();

            // Remove from Storage
            Storage.removeBook(isbn);
            
            UI.toggleNoBooksMessage(); // Update message after deletion
            alert('Book removed successfully!');
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    
    static toggleNoBooksMessage() {
        const books = Storage.getBooks();
        const msg = document.getElementById('no-books-msg');
        
        if (books.length === 0) {
            msg.style.display = 'block';
        } else {
            msg.style.display = 'none';
        }
    }
}


// === EVENT LISTENERS ===

// Event: Display Books on load
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual form submission
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validation (Simple check for uniqueness on ISBN)
    const books = Storage.getBooks();
    const isDuplicate = books.some(book => book.isbn === isbn);

    if (title === '' || author === '' || isbn === '') {
        alert('Please fill in all fields');
        return;
    } else if (isDuplicate) {
        alert('A book with this ISBN already exists!');
        return;
    }

    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to Storage
    Storage.addBook(book);

    // Clear fields
    UI.clearFields();
    
    // Update message after addition
    UI.toggleNoBooksMessage();
    
    alert('Book added successfully!');
});

// Event: Remove a Book (using event delegation on the book list body)
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
});