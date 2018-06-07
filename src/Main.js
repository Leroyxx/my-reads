import React from 'react'
import { Link } from 'react-router-dom'
import { Shelves } from './Shelves'

class Main extends React.Component {
  render() {
    return <div className="list-books">
      <div className="list-books-title"> <h1>MyReads</h1>  </div>
      <Shelves
      shelvesArray={this.props.shelvesArray}
      sortResponse={this.props.sortResponse}
      moveBook={this.props.moveBook}
    />
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  }
}

export default Main
