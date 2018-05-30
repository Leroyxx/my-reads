import React from 'react'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'

class Shelves extends React.Component {
  state = {
    shelves: [
      {
        title: 'Currently Reading',
        books: [
          {
            title: 'To Kill A Mockingbird',
            author: 'Harper Lee',
            thumbnail: 'http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api'
          },
          {
            title: "Ender's Game",
            author: 'Orson Scott Card'
          },
        ]
      },
      {
        title: 'Want to Read',
        books: [
          {
            title: '1776',
            author: 'David McCullough'
          },
          {
            title: "Harry Potter and the Sorcerer's Stone",
            author: 'J.K. Rowling'
          }
        ]
      },
      {
        title: 'Read',
        books: [
          {
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien'
          },
          {
            title: "Oh, the Places You'll Go!",
            author: 'Seuss'
          },
          {
            title: "The Adventures of Tom Sawyer",
            author: "Mark Tawin"
          }
        ]
      }
    ]
  }

  componentDidMount() {
    BooksAPI.getAll().then(response => this.setState(prevState => ( {...prevState, books: response} ), () => console.log(this.state)  ) )
  }

  render() {
    return this.state.shelves.map(shelf => (<div className="list-books-content" key={shelf.title.toLowerCase().split(' ').join('-')}>
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
                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.book.thumbnail})` }}></div>
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
                <div className="book-authors">{this.props.book.author}</div>
              </div>
            </li>
  }
}
export default Shelves
