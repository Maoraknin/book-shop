'use strict'
const STORAGE_KEY = 'bookDB'
const STORAGE_VIEW_KEY = 'viewDB'
const PAGE_SIZE = 6

var gPageIdx = 0
var gBooks
var gBookSelected
var gSortParam
var gIsOpenModal = false
var gViewType
// var gDesc = 1

_createBooks()

const PAGE_NUMBER = Math.ceil(gBooks.length / PAGE_SIZE)



function renderBooksSortedByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const sortBy = queryStringParams.get('sort')
    const isDesc = queryStringParams.get('isDesc')


    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    ////////////////      PROBLEM WITH isDesc, CHECK!     ////////////////
    ////////////////      PROBLEM WITH MODEL UPDATE, CHECK!     //////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////


    // const isOpenModal = queryStringParams.get('modal')

    if (!sortBy) return
    setBookSorted(sortBy, !isDesc)
    upDateSelect(sortBy, !isDesc)

    // updateModal(isOpenModal)
}

function setBookSorted(sortBy, isDesc) {
    var prop = (isDesc)? -1 : 1
    gPageIdx = 0
    gSortParam = sortBy
    if (gSortParam === 'title') gBooks.sort((b1, b2) => b1.title.localeCompare(b2.title) * prop) 
    else if (gSortParam === 'rate') gBooks.sort((b1, b2) => (b2.rate - b1.rate) * prop)
    else if (gSortParam === 'price')  gBooks.sort((b1, b2) => (b2.price - b1.price) * prop)

    return gSortParam
}

function updateModal(boolean) {
    gIsOpenModal = boolean
    return gIsOpenModal
}

function changePage(param) {
    if (param === 'next') gPageIdx++
    else if (param === 'prev') gPageIdx--
    else gPageIdx = param
}


function getBooks() {
    var startIdx = gPageIdx * PAGE_SIZE
    return gBooks.slice(startIdx, startIdx + PAGE_SIZE)
}


function updateSelectedBook(book) {
    gBookSelected = book
    return gBookSelected
}

function updateBook(bookId, bookPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = bookPrice
    _saveBooksToStorage()
    return book
}



function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    if (bookIdx === -1) return
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book

}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}


function searchBook(title) {
    gPageIdx = 0
    const book = gBooks.find(book => title === book.title)
    return book
}

function showBook(title) {
    const bookIdx = gBooks.findIndex(book => title === book.title)
    const book = gBooks[bookIdx]
    gBooks.splice(bookIdx, 1)
    gBooks.unshift(book)
    _saveBooksToStorage()
}

function updateRate(rate) {
    gBookSelected.rate = rate
    _saveBooksToStorage()
}

function changeView(viewType) {
    gViewType = viewType
    _saveViewTypeToStorage()
    return gViewType
}

function getViewType(){
    if(!gViewType) gViewType = loadFromStorage(STORAGE_VIEW_KEY)
    return gViewType
}


function _createBook(title, price, rate = 0) {
    return {
        id: makeId(),
        title,
        price,
        desc: makeLorem(),
        rate
    }

}

// function toggleReadBook(bookId){
//     const book = gBooks.find(book => bookId === book.id)
//     book.isRead = !book.isRead
//     _saveBooksToStorage()
//     return book
// }

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = [
            _createBook('Harry-Potter', 14.99),
            _createBook('Snow-White', 18.99),
            _createBook('JS for Dummys', 9.99),
            _createBook('In Search of Lost Time', 39.99),
            _createBook('Ulysses', 19.99),
            _createBook('Don Quixote', 24.99),
            _createBook('One Hundred Years of Solitude', 14.99),
            _createBook('The Great Gatsby', 39.99),
            _createBook('Moby Dick', 15.99),
            _createBook('War and Peace', 9.99),
            _createBook('To Kill a Mockingbird', 14.99),
            _createBook('A Passage to India', 19.99),
            _createBook('Invisible Man', 13.99),
            _createBook('Beloved', 24.99)
        ]
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function _saveViewTypeToStorage() {
    saveToStorage(STORAGE_VIEW_KEY, gViewType)
}