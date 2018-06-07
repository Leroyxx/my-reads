import React from 'react'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'
import Book from './Book.js'

export class Shelves extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    BooksAPI.getAll()
    .then(response => {
      console.log(response);
      this.props.sortResponse(response);
      } )
  }

  render() { return this.props.shelvesArray.map(shelf => (<div className="list-books-content" key={shelf.title.toLowerCase().split(' ').join('-')}>
        <BookShelf shelf={shelf} moveBook={(book, v) => {this.props.moveBook(book, v)}} shelvesArray={this.props.shelvesArray} page={this.props.page}/>
      </div>));
}
}

class BookShelf extends React.Component {
  render() {
    return <div className="bookshelf">
      <h2 className="bookshelf-title">{this.props.shelf.title}</h2>
      <ol className="books-grid">
        {this.props.shelf.books.map(book => <Book book={book} shelvesArray={this.props.shelvesArray}
          moveBook={(book, e) => {this.props.moveBook(book, e.target.value)}} key={book.title.toLowerCase().split(' ').join('-')}
          page={this.props.page}/>)}
      </ol>
    </div>
  }
}
