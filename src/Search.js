import React from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import {DebounceInput} from 'react-debounce-input';
import Book from './Book.js'

class Search extends React.Component {
  state = {
    query: '',
    sentQuery: 'query',
    results: [],
    isSearching: false
  }

  ask4Books(query) {
    this.setState( { query: query, isSearching: true });
    if (query.length>2) {
      BooksAPI.search(query)
      .then(  response => {
        if (response.isArray) {
        response = response.map( book => {
          if (book.authors) { //Turns out some books don't have em!
                book.authorsC = book.authors.reduce((arr, author, index, array) => {
                if( index !== array.length-1) { return [...arr, author, ", "] }
                else { return [...arr, author] }  }, [])
              }
              return book
            }) }
        this.setState(  { sentQuery: query, results: response, isSearching: false } ) } )
    }
  }

  //We need to fetch the shelf names from the server so we know where to place new books,
  //even if a user landed on the search page without first visiting the main page
  componentDidMount() {
    BooksAPI.getAll()
    .then(response => {
      console.log(response);
      this.props.sortResponse(response);
      } )
  }

  render() {
    return <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to="/">Close</Link>
        <div className="search-books-input-wrapper">
          {/*
            NOTES: The search from BooksAPI is limited to a particular set of search terms.
            You can find these search terms here:
            https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

            However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
            you don't find a specific author or title. Every search is limited by search terms.
          */}
          <DebounceInput
            placeholder="Search by title or author"
            debounceTimeout={450}
            onChange={(e) => this.ask4Books(e.target.value)}/>

        </div>
      </div>
      <SearchResults
        results={this.state.results}
        userQuery={this.state.query}
        sentQuery={this.state.sentQuery}
        shelvesArray={this.props.shelvesArray}
        moveBook={(book, v, cb) => this.props.moveBook(book, v, cb)}
        isSearching={this.state.isSearching}
        booksArray={this.props.booksArray}
      />
    </div>
  }
}

const SearchResults = (props) => {
  const tagResults = (results, userQuery, sentQuery, isSearching) => {
      if (userQuery.length <= 2 && userQuery.length !== 0) {return <p>Can you try being a bit more specific?</p>}
      if (results.error && sentQuery.includes(userQuery)) return <p>No results sorry!</p>
      if (userQuery.length === 0) { return <p>Get lookin' for dem books and they'll show up here!</p>}
      if (userQuery.length > 2 && isSearching && !sentQuery.includes(userQuery)) {return <p>Looking for books...</p>}
      if (results.length > 0 && sentQuery) {
        if (sentQuery.includes(userQuery)) return results.map(book => {
        return <Book book={book}
          searched={true}
          booksArray={props.booksArray}
          shelvesArray={props.shelvesArray}
          moveBook={(book, e, cb) => {props.moveBook(book, e.target.value, cb)}}
          key={book.id}/>
        })
        else if (userQuery.length <= 2) {return <p>Can you try being a bit more specific?</p>}
      }
      if (userQuery.length <= 2) {return <p>Can you try being a bit more specific?</p>}
      else return <p></p>
  }
  return (<div className="search-books-results">
    <ol className="books-grid">
      {tagResults(props.results, props.userQuery, props.sentQuery, props.isSearching)}
    </ol>
  </div>)
}

export default Search
