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
              authorsC: '', //Authors with commas between them
              imageLinks: {
              thumbnail: ''
            }
          }
        ]
      }
    ]
  }

  sortResponse(response) {
    //Iterate over the books in the response
    let shelvesUndone = response.reduce(
      (object, book) => {
        //If the shelf of the book is not listed as a key in the
        //new object being created, create a shelf inside the object with the
        //shelf name as a key and assign it a value of an empty books array
        if (!object[book.shelf]) {
          object[book.shelf] = [];
        }
        //then push the books into the array
        object[book.shelf].push(book)
        return object
      }, {} //Initial value is an empty object
    );

    const camel2title = (camelCase) => camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase());
    //function by renevanderark on stackoverflow.com

    let shelvesArray = [];
    Object.keys(shelvesUndone).forEach(shelf => shelvesArray.push({title: camel2title(shelf), untitled: shelf}));
    shelvesArray.forEach(shelf => shelf.books = shelvesUndone[shelf.untitled]);
    shelvesArray.forEach(shelf => shelf.books.forEach(book => {
      book.authorsC = book.authors.reduce((arr, author, index, array) => {
        if( index !== array.length-1) { return [...arr, author, ", "] }
        else { return [...arr, author] }  }, []);
        //Add commas between authors and call this array differently (authorsC)
      } ) )

      return shelvesArray
    }

  componentDidMount() {
    BooksAPI.getAll()
    .then(response => {
      let shelvesArray = this.sortResponse(response);
      this.setState(  { shelvesArray: shelvesArray },
        () => {
          console.log(this.state) }
      )
      } )
  }

  moveBook(book, shelf) {
    BooksAPI.update(book, shelf).then(response => {
      let shelvesArray = this.sortResponse(response);
      this.setState( {shelvesArray: shelvesArray} )
    } )
  }

  render() {
    return this.state.shelvesArray.map(shelf => (<div className="list-books-content" key={shelf.title.toLowerCase().split(' ').join('-')}>
        <BookShelf shelf={shelf} shelvesArray={this.state.shelvesArray}/>
      </div>));
}
}

class BookShelf extends React.Component {
  render() {
    return <div className="bookshelf">
      <h2 className="bookshelf-title">{this.props.shelf.title}</h2>
      <ol className="books-grid">
        {this.props.shelf.books.map(book => <Book book={book} shelvesArray={this.props.shelvesArray} key={book.title.toLowerCase().split(' ').join('-')}/>)}
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
                  <BookShelfChanger book={this.props.book} shelvesArray={this.props.shelvesArray} shelf={this.props.book}/>
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
      <select>
      <option value="none" disabled>Move to...</option>
      {this.props.shelvesArray.map(shelf => {
        if (shelf.untitled === this.props.book.shelf) {
        return <option disabled selected value={shelf.untitled}>{shelf.title}</option> }
        return <option value={shelf.untitled}>{shelf.title}</option>
      }) }
      <option value="none">None</option>
      </select>
      </div>
  }
}
export default Shelves
