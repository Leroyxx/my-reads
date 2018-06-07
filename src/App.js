import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import './App.css'
import Search from './Search'
import Main from './Main'

import * as BooksAPI from './BooksAPI'

class BooksApp extends React.Component {
  constructor(props) {
        super(props)
        this.state = {
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

    this.moveBook = this.moveBook.bind(this);
    this.sortResponse = this.sortResponse.bind(this);

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

    let sArray = [];
    Object.keys(shelvesUndone).forEach(shelf => sArray.push({title: camel2title(shelf), untitled: shelf}));
    sArray.forEach(shelf => shelf.books = shelvesUndone[shelf.untitled]);
    sArray.forEach(shelf => shelf.books.forEach(book => {
      book.authorsC = book.authors.reduce((arr, author, index, array) => {
        if( index !== array.length-1) { return [...arr, author, ", "] }
        else { return [...arr, author] }  }, []);
        //Add commas between authors and call this array differently (authorsC)
      } ) )
      return this.setState( { fullResponse: response, shelvesArray: sArray },
        //() => {
         //console.log(this.state) }
      )
    }


  moveBook(book, shelf) {
    // console.log(book, shelf);
    BooksAPI.update(book, shelf).then(response => {
      let id2book = id => this.state.fullResponse.find(book => book.id === id);

      let bookedResponse = Object.entries(response)
      .reduce((books, [shelf, bookIDs]) => {
        bookIDs.forEach(bookID => {
          let book = id2book(bookID);
          book.shelf = shelf;
          books.push(book);
        })
        return books
      }, []);

      // console.log({booked: bookedResponse});
      return this.sortResponse(bookedResponse);
    } )
  }


  render() {
    return (
      <BrowserRouter>
      <div className="app">
        <Route exact path="/search" component={Search} />
        <Route exact path="/" render={() => { return <Main
          sortResponse={this.sortResponse}
          moveBook={this.moveBook}
          shelvesArray={this.state.shelvesArray}
        /> } } />
      </div>
    </BrowserRouter>
    )
  }
}

export default BooksApp
