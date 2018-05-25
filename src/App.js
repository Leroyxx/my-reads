import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import Search from './Search'
import Shelves from './Shelves'

class BooksApp extends React.Component {

  render() {
    return (
      <BrowserRouter>
      <div className="app">
        <Route exact path="/search" component={Search} />
        <Route exact path="/" component={Shelves} />
      </div>
    </BrowserRouter>
    )
  }
}

export default BooksApp
