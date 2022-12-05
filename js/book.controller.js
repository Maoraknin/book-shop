'use strict'

function onInit() {
    renderBooksSortedByQueryStringParams()
    renderBooks()
}

function upDateSelect(sortBy, isDesc){
    document.querySelector('select').value = sortBy
    document.querySelector('.sort-desc').checked = isDesc
}


function onUpdateRate(ev) {
    ev.preventDefault()
    const rate = document.querySelector('input[name="rate"]').value
    document.querySelector('input[name="rate"]').value = ''
    updateRate(rate)
    renderBooks()
}



function onChangeRate(param) {
    var rate = document.querySelector('input[name="rate"]').value
    if (rate === '10' && param === '1' || rate === '0' && param === '-1') return
    rate = (param === '1') ? ++document.querySelector('input[name="rate"]').value : --document.querySelector('input[name="rate"]').value
    console.log(rate);
    updateRate(rate)
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook(ev) {
    ev.preventDefault()
    const name = document.querySelector('input[name="name"]').value
    document.querySelector('input[name="name"]').value = ''
    const price = +document.querySelector('input[name="price"]').value
    document.querySelector('input[name="price"]').value = ''
    if (!name || !price) return
    if (typeof price !== 'number') return
    addBook(name, price)
    renderBooks()
}

function onSearchBook(ev) {
    ev.preventDefault()
    const name = document.querySelector('input[name="search"]').value
    document.querySelector('input[name="search"]').value = ''
    if (!name) return
    const book = searchBook(name)
    if (!book){
        alert('Not in Stock...')
        return
    } 
    showBook(name)
    renderBooks()

}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    const newPrice = prompt('Enter the current price')
    if (newPrice && newPrice !== book.price) {
        updateBook(bookId, newPrice)
        renderBooks()
    }
}


function onSortBy(sortParam) {
    const isDesc = document.querySelector('.sort-desc').checked
    if(!sortParam) sortParam = gSortParam
    setBookSorted(sortParam, isDesc)
    renderBooks()

    // queryStringParams()

    const queryStringParams = `?sort=${sortParam}&&isDesc=${isDesc}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}


function onReadBook(BookId) {
    var book = getBookById(BookId)
    updateSelectedBook(book)
    updateModal(true)
    // queryStringParams()
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = book.price + '$'
    elModal.querySelector('p').innerText = book.desc
    document.querySelector('input[name="rate"]').value = '0'
    elModal.classList.add('open')
    // updateModal()

    // const queryStringParams = `&&modal=${gIsOpenModal}`
    // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    // window.history.pushState({ path: newUrl }, '', newUrl)

}

function onCloseModal() {
    updateSelectedBook(null)
    updateModal(false)
    // queryStringParams()
    document.querySelector('.modal').classList.remove('open')
}




function renderBooks() {
    var books = getBooks()
    renderByViewType(books)

    var strHtml = ''
    for (var i = 0; i < PAGE_NUMBER; i++) {
        strHtml += `<button class="page-num-btn" onclick="onChangePage(${i})">${i + 1}</button>`
    }
    document.querySelector('.page-num-btns').innerHTML = strHtml
}

function onChangeView(viewType){
    changeView(viewType)
    renderBooks()
}



function renderByViewType(books){
    var viewType = getViewType()
    if(viewType === 'table') renderByTable(books)
    else if(viewType === 'divs') renderByDivs(books)
}


function renderByTable(books){
    document.querySelector('.div-books-container').classList.add('hidden')
    document.querySelector('table').classList.remove('hidden')
    var strHtmls = books.map(book => `
    <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.price}$</td>
        <td>
        <button onclick="onReadBook(${book.id})" class="read">Read</button>
        <button onclick="onUpdateBook(${book.id})" class="update">Update</button>
        <button onclick="onRemoveBook(${book.id})" class="delete">Delete</button>
        </td>
        <td>${book.rate}</td>
        
    </tr>
`)
document.querySelector('.table-books-container').innerHTML = strHtmls.join('')
}

function renderByDivs(books){
    document.querySelector('table').classList.add('hidden')
    document.querySelector('.div-books-container').classList.remove('hidden')
    var strHtmls = books.map(book => `
    <div class="book-div">
        <h3>ID: ${book.id}</h3>
        <h3>Title: ${book.title}</h3>
        <h3>Price: ${book.price}$</h3>
        <div>
        <button onclick="onReadBook(${book.id})" class="read">Read</button>
        <button onclick="onUpdateBook(${book.id})" class="update">Update</button>
        <button onclick="onRemoveBook(${book.id})" class="delete">Delete</button>
        </div>
        <h3>Rate: ${book.rate}</h3>
        
    </div>
`)
document.querySelector('.div-books-container').innerHTML = strHtmls.join('')
}


function onChangePage(param) {
    changePage(param)
    const elNextBtn = document.querySelector('.next-btn')
    const elPrevBtn = document.querySelector('.prev-btn')
    if(gPageIdx === 0){
        elPrevBtn.setAttribute('disabled', '')
        elPrevBtn.classList.add('disabled')
        elNextBtn.removeAttribute('disabled', '')
        elNextBtn.classList.remove('disabled')
    } 
    else if(gPageIdx === PAGE_NUMBER - 1){
        elNextBtn.setAttribute('disabled', '')
        elNextBtn.classList.add('disabled')
        elPrevBtn.classList.remove('disabled')
        elPrevBtn.removeAttribute('disabled', '')
    } 
    else{
        elPrevBtn.removeAttribute('disabled', '')
        elPrevBtn.classList.remove('disabled')
        elNextBtn.removeAttribute('disabled', '')
        elNextBtn.classList.remove('disabled')
    }
    renderBooks()
}

// function queryStringParams() {
//     const queryStringParams = `?sort=${gSortParam}&&modal=${gIsOpenModal}`
//     const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
//     window.history.pushState({ path: newUrl }, '', newUrl)
// }

