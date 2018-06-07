import React from 'react'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'

class Shelves extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props);
  }

  componentDidMount() {
    BooksAPI.getAll()
    .then(response => {
      console.log(response);
      this.props.sortResponse(response);
      } )
  }

  render() { return this.props.shelvesArray.map(shelf => (<div className="list-books-content" key={shelf.title.toLowerCase().split(' ').join('-')}>
        <BookShelf shelf={shelf} moveBook={(book, v) => {this.props.moveBook(book, v)}} shelvesArray={this.props.shelvesArray}/>
      </div>));
}
}

class BookShelf extends React.Component {
  render() {
    return <div className="bookshelf">
      <h2 className="bookshelf-title">{this.props.shelf.title}</h2>
      <ol className="books-grid">
        {this.props.shelf.books.map(book => <Book book={book} shelvesArray={this.props.shelvesArray} moveBook={(book, e) => {this.props.moveBook(book, e.target.value)}} key={book.title.toLowerCase().split(' ').join('-')}/>)}
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
                  <BookShelfChanger book={this.props.book} shelvesArray={this.props.shelvesArray}
                    shelf={this.props.book} onChange={(e) => {this.props.moveBook(this.props.book, e)}}
                    />
                </div>
                <div className="book-title">{this.props.book.title}</div>
                <div className="book-authors">{this.props.book.authorsC}</div>
              </div>
            </li>
  }
}

class BookShelfChanger extends React.Component {
  render() {
    return <div className="book-shelf-changer">
      <select defaultValue={this.props.book.shelf} onChange={(e) => {this.props.onChange(e)}}>
      <option value="none" disabled>Move to...</option>
      {this.props.shelvesArray.map(shelf => {
        if (shelf.untitled === this.props.book.shelf) {
        return <option disabled value={shelf.untitled}
                key={'ch-'+this.props.book.id+'-'+shelf.untitled}>{shelf.title}</option> }
        else return <option value={shelf.untitled}
                key={'ch-'+this.props.book.id+'-'+shelf.untitled}>{shelf.title}</option>
      }) }
      <option value="none">None</option>
      </select>
      </div>
  }
}
export default Shelves
