import React from 'react'


class Book extends React.Component {
  state = {
    isActive: this.isBookInLibrary()
  }

  isBookInLibrary() {
      const book = this.props.book;
      const booksArray = this.props.booksArray;
      let inLibrary;
      if (booksArray) { inLibrary = booksArray.find(b => b.id === book.id) }
      if (inLibrary) {return true}
      else {return false}
    }

  toggleActive = (shelf) => {
    //console.log('hello')
    this.setToActive = () => this.setState( {isActive: true} );

    this.unsetToActive = () => this.setState ( {isActive: false} );

    this.setState( {isActive: this.isBookInLibrary()}, () => {
      //console.log(isActive);
      if (shelf === 'none') {return this.unsetToActive()}
      else {return this.setToActive()}
    } );

  }

  render() {
    let book = this.props.book;
    let changer = <BookShelfFetcher book={book} shelvesArray={this.props.shelvesArray}
        booksArray={this.props.booksArray} onChange={(e) => {this.props.moveBook(this.props.book, e, this.toggleActive)}}
      />;
    if (this.isBookInLibrary()) {
      book = this.props.booksArray.find(b => b.id === this.props.book.id);
      changer = <BookShelfChanger book={book}
        searched={this.props.searched}
        booksArray={this.props.booksArray}
        shelvesArray={this.props.shelvesArray}
        onChange={(e) => {if (this.toggleActive) {return this.props.moveBook(this.props.book, e, this.toggleActive)} else {this.props.moveBook(this.props.book, e) } }}
      />;
    }
    //console.log(book);
    return <li>
              <div className="book">
                <div className="book-top">
                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.book.imageLinks ? this.props.book.imageLinks.thumbnail : ''})` }}></div>
                  {changer}
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authorsC}</div>
              </div>
            </li>
  }
}

class BookShelfChanger extends React.Component {
  render() {
    let book = this.props.book;
    let s = book.shelf;
    //console.log('rendered');
    return <div className="book-shelf-changer">
      <select defaultValue={s} onChange={(e) => this.props.onChange(e)}>
      <option value="none" disabled>Move to...</option>
      {this.props.shelvesArray.map(shelf => {
        if (shelf.untitled === s) {
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

class BookShelfFetcher extends React.Component {
  render() {
    return <div className="book-shelf-fetcher">
    <select defaultValue="none" onChange={(e) => this.props.onChange(e)}>
    <option value="none" disabled>Add to:</option>
    {this.props.shelvesArray.map(shelf => {
      return <option value={shelf.untitled}
              key={'ch-'+this.props.book.id+'-'+shelf.untitled}>{shelf.title}</option>
    }) }
    </select>
  </div>

  }
}

export default Book
