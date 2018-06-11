import React from 'react'
import * as BooksAPI from './BooksAPI'
import Book from './Book.js'

export class Shelves extends React.Component {

  componentDidMount() {
    BooksAPI.getAll()
    .then(response => {
      //console.log(response);
      this.props.sortResponse(response);
      } )
  }

  render() { return this.props.shelvesArray.map(shelf => (<div className="list-books-content" key={shelf.title.toLowerCase().split(' ').join('-')}>
        <BookShelf shelf={shelf} moveBook={(book, v) => {this.props.moveBook(book, v)}} booksArray={this.props.booksArray}
          shelvesArray={this.props.shelvesArray} />
      </div>));
}
}

class BookShelf extends React.Component {
  render() {
    return <div className="bookshelf">
      <h2 className="bookshelf-title">{this.props.shelf.title}</h2>
      <ol className="books-grid">
        {this.props.shelf.books.map(book => <Book book={book} booksArray={this.props.booksArray} shelvesArray={this.props.shelvesArray}
          moveBook={(book, e) => {this.props.moveBook(book, e.target.value)}} key={book.title.toLowerCase().split(' ').join('-') + '-' + book.id}
          page={this.props.page}/>)}
      </ol>
    </div>
  }
}
