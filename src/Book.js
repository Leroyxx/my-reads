import React from 'react'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'


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

export default Book
