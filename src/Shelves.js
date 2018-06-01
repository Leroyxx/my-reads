import React from 'react'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'

class Shelves extends React.Component {
  state = {
    shelvesArray: [
      {
        title: 'Currently Reading',
        books: [
          {
            title: 'Loading Books',
            authors: '',
            imageLinks: {
            thumbnail: ''
          }
        }
      ]
    }
  ]
}

  componentDidMount() {
    BooksAPI.getAll()
    .then(response => {
      let shelvesUndone = response.reduce(
        (object, book) => {
          if (!object[book.shelf]) {
            object[book.shelf] = [];
          }
          object[book.shelf].push(book)
          return object
        }, {} //initial value is an empty object
      )

      const camel2title = (camelCase) => camelCase
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase());
      //function by renevanderark on stackoverflow.com

      let shelvesArray = [];
      Object.keys(shelvesUndone).forEach(shelf => shelvesArray.push({title: camel2title(shelf), untitled: shelf}));
      shelvesArray.forEach(shelf => shelf.books = shelvesUndone[shelf.untitled]);
      shelvesArray.forEach(shelf => shelf.books.forEach(book => {
        book.authors = book.authors.reduce((arr, author, index, array) => { if( index !== array.length-1) { return [...arr, author, ", "] }
        else { return [...arr, author] }  }, []);
        //add commas between authors
        } ) )

      this.setState(  { shelvesArray: shelvesArray },
        () => {
          console.log(this.state) }
      )
      } )
  }

  updateBooks(book, shelf) {
    BooksAPI.update(book, shelf).then(
      response => this.setState( {} )
    )
  }

  render() {
    return this.state.shelvesArray.map(shelf => (<div className="list-books-content" key={shelf.title.toLowerCase().split(' ').join('-')}>
        <BookShelf title={shelf.title} books={shelf.books}/>
      </div>));
}
}

class BookShelf extends React.Component {
  render() {
    return <div className="bookshelf">
      <h2 className="bookshelf-title">{this.props.title}</h2>
      <ol className="books-grid">
        {this.props.books.map(book => <Book book={book} key={book.title.toLowerCase().split(' ').join('-')}/>)}
      </ol>
    </div>
  }
}

class Book extends React.Component {
  render() {
    return <li>
              <div className="book">
                <div className="book-top">
                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.book.imageLinks.thumbnail })` }}></div>
                  <div className="book-shelf-changer">
                    <select>
                      <option value="none" disabled>Move to...</option>
                      <option value="currentlyReading">Currently Reading</option>
                      <option value="wantToRead">Want to Read</option>
                      <option value="read">Read</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div className="book-title">{this.props.book.title}</div>
                <div className="book-authors">{this.props.book.authors}</div>
              </div>
            </li>
  }
}
export default Shelves
