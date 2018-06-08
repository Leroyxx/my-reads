import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
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
        ],
        fullResponse: [
          {
            title: 'Loading Books',
            authors: '',
            authorsC: '', //Authors with commas between them
            imageLinks: {
              thumbnail: ''
            },
            shelf: 'Currently Reading'
          } ]
      }

    this.moveBook = this.moveBook.bind(this);
    this.sortResponse = this.sortResponse.bind(this);

  }
  //cbShelf is the shelf supplied for the callback function to use as a parameter.
  //The shelf can be 'none', 'wantToRead' etc and is derived from the event.target.value
  //when a user adds/moves a book. The callback mechanism was implemented towards the end
  //of coding so that if the user adds a new book he can automatically
  //change where he placed it from the Search route in the app. And if he regrets adding it
  //while still on the page then he can. The callback function that is passed in is Book's
  //toggleActive.
  sortResponse(response, cb, cbShelf) {
    //console.log(cbShelf);
    //Add commas between authors and call this array differently (authorsC)));
    response = response.map( book => {
      if (book.authors) { //Turns out some books don't have em!
            book.authorsC = book.authors.reduce((arr, author, index, array) => {
            if( index !== array.length-1) { return [...arr, author, ", "] }
            else { return [...arr, author] }  }, [])
          }
          return book
        })
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

      return this.setState( { fullResponse: response, shelvesArray: sArray },
        () => { if (cb) {
          cb(cbShelf); } }
      )
    }


  moveBook(book, shelf, cb) {
    // console.log(book, shelf);
    BooksAPI.update(book, shelf).then(response => {
      let errorID; //ID of a book that doesn't exist locally
      let id2book = id => this.state.fullResponse.find(book => book.id === id);
      let bookedResponse = Object.entries(response)
      .reduce((books, [shelf, bookIDs]) => {
        bookIDs.forEach(bookID => {
          let book = id2book(bookID);
          if (book) {book.shelf = shelf;
          books.push(book)}
          else {errorID = bookID}
        })
        return books
      }, []);

      // console.log({booked: bookedResponse});
      if (errorID) { //It's a new book
        BooksAPI.get(errorID).then(book => { book.shelf = shelf; bookedResponse.push(book);
        this.sortResponse(bookedResponse, cb, shelf) })
      } else {
        this.sortResponse(bookedResponse, cb, shelf);
      }
    } )
  }

  render() {
    return (
      <BrowserRouter>
      <div className="app">
        <Route exact path="/search" render={() => { return <Search
                    sortResponse={this.sortResponse}
          moveBook={this.moveBook}
          shelvesArray={this.state.shelvesArray}
          booksArray={this.state.fullResponse}
        /> }} />
        <Route exact path="/" render={() => { return <Main
          sortResponse={this.sortResponse}
          moveBook={this.moveBook}
          shelvesArray={this.state.shelvesArray}
          booksArray={this.state.fullResponse}
        /> } } />
      </div>
    </BrowserRouter>
    )
  }
}

export default BooksApp
