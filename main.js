getData() // calling the main function to get the JSON

// assigning document elements to variables
const noResultsDiv = document.getElementById("noResultsFound")
const perPageDiv = document.getElementById("perPage")
const userInput = document.getElementById('search')
const addBtn = document.getElementById('addElement')
const totalResults = document.getElementById('totalResults')
const titleForm = document.getElementById('titleForm')
const descriptionForm = document.getElementById('descriptionForm')
const imageForm = document.getElementById('imageForm')
const form = document.getElementById("myForm")
const fade = document.getElementById("pageFade")
const formWarn = document.getElementById("formWarn")
const instructions = document.getElementById("instructionsMain")

// declaring different variables
let currentPage = 1 // default page of the table set to 1
let totalPages // will assign a number of pages based on how much data needs to be shown
let perPage = perPageDiv.value // will be used to show how many items will be shown on the table at once
let locaRawlData // just a variable to keep the received data from the JSON
let properData
let modalOpened = false

// add event listeners
addBtn.addEventListener("click", openAddModal)
document.onkeydown = keyPressed;

// creating an async function to get the data from the JSON
async function getData() {
    const response = await fetch("data.json")
    let data = await response.json();
    processData(data)
}

function processData(data) {
    // saving data from the JSON to a global variable in order to access it later
    localRawData = data
    properData = localRawData
    showData()
    changePage(1)
}

function showData() {
    let data = []
    for (i in properData) {
        data.push(properData[i])
    }
    // calculating the number of pages
    totalPages = Math.ceil(data.length / perPage)
    totalResults.innerHTML = data.length

    // keeping in the local data variable only the elements that needs to be shown
    let elementsToRemove = (currentPage - 1) * perPage
    data.splice(0, elementsToRemove)
    data.splice(perPage)

    addPageButtons()
    processTable(data)
    stylePageBtns()
}

function changePerPage(x) {
    perPage = perPageDiv.value
    showData()
    addPageButtons()
    changePage(1)
}

function processTable(data) {
    let table = document.getElementById("mainTable");
    table.innerHTML = ''

    //create a header table row and table headers
    let thr = document.createElement("tr")
    let titleHeader = document.createElement("th")
    let descrHeader = document.createElement("th")
    let imageHeader = document.createElement("th")

    // adding values for headers
    titleHeader.innerHTML = "Title"
    descrHeader.innerHTML = "Description"

    thr.classList.add("headerRow")

    // appending table headers to the table row
    thr.appendChild(imageHeader)
    thr.appendChild(titleHeader)
    thr.appendChild(descrHeader)

    // appending table row to the table tag from HTML
    table.appendChild(thr)

    for (i in data) {
        let tr = document.createElement("tr");
        let title = document.createElement('td')
        let descr = document.createElement('td')
        let imgDiv = document.createElement('td')

        title.innerHTML = data[i].title
        descr.innerHTML = data[i].description

        tr.classList.add("dataRow")
        title.classList.add("elementTitle")
        imgDiv.classList.add("elementImage")
        imgDiv.style.backgroundImage = `url(${data[i].imagePath})`

        tr.appendChild(imgDiv)
        tr.appendChild(title)
        tr.appendChild(descr)
        table.appendChild(tr)
    }

    let remainingRows = perPage - data.length
    if (remainingRows != 0) {
        for (i = 0; i < remainingRows; i++) {
            let tr = document.createElement("tr");
            let title = document.createElement('td')
            let descr = document.createElement('td')
            let imgDiv = document.createElement('td')

            tr.classList.add("emptyRow")

            tr.appendChild(imgDiv)
            tr.appendChild(title)
            tr.appendChild(descr)
            table.appendChild(tr)
        }
    }
}

// add buttons based on how many pages there are
function addPageButtons() {
    let allBtns = document.getElementById('allBtns')
    allBtns.innerHTML = '' // first remove all the previous buttons (if any)
    for (i = 1; i <= totalPages; i++) {
        let btn = document.createElement("button") // create a button element
        btn.setAttribute('onclick', `changePage(${i})`) // give the attribute for onclick to call the "changePage()" function
        btn.innerHTML = i // also the text of the button
        allBtns.appendChild(btn) // append the button to the buttons div in HTML
    }
}

// a function that changes the pages of the table based on a value
function changePage(x) {
    if (x === 'prev') { // if the value is equal to 'prev'
        if (currentPage > 1) {
            currentPage-- // it subtracts 1 from the currentPage variable
        }
    } else if (x === 'next') { // if the value is equal to 'next'
        if (currentPage !== totalPages) {
            currentPage++ // it adds 1 from the currentPage variable
        }
    } else if (x === 'last') { // if the value is equal to 'next'
        currentPage = totalPages // it adds 1 from the currentPage variable
    } else if (typeof x == "number") { // if the value is equal to 'next'
        currentPage = x // it adds 1 from the currentPage variable
    }
    showData()
}

function stylePageBtns() {
    // check if user is on the first or last page
    // so those buttons will be disabled

    let frontState = false
    let endState = false

    if (currentPage === 1) {
        frontState = true
    }
    if (currentPage === totalPages) {
        endState = true
    }

    // disable the buttons
    let front = document.getElementsByClassName("front-extremity")
    for (i = 0; i < front.length; i++) {
        front[i].disabled = frontState
    }
    let end = document.getElementsByClassName("end-extremity")
    for (i = 0; i < end.length; i++) {
        end[i].disabled = endState
    }
    // adding a class to the selected page button
    let numberedBtns = document.getElementById('allBtns').getElementsByTagName('button')
    for (i = 0; i < numberedBtns.length; i++) {
        if (i == currentPage - 1) {
            numberedBtns[i].style.backgroundColor = "#189AD6"
            numberedBtns[i].style.color = "white"
        }
    }

}

// function that loops through all data and filter based on user input
function search() {
    properData = [] // an array that will contain the data to be shown in the table
    let noResults = false
    let userInputValue = userInput.value // save the user input

    // looping through all elements (including the ones added by the user) and check if they contain what the user inserted
    localRawData.forEach(el => {
        let checkTitle = el.title.toUpperCase().includes(userInputValue.toUpperCase())
        let checkDescr = el.description.toUpperCase().includes(userInputValue.toUpperCase())
        if (checkTitle || checkDescr) {
            properData.push(el)
        }
    });

    // check if the user has typed anything and if the function found any element that fits
    if (userInputValue.length != 0) {
        if (properData.length === 0) {
            noResults = true
        }

    } else {
        properData = localRawData
    }

    // the variable noResult has a default state as "false" but it gets "true" after checkups
    // calling the function "noResultFound" with the boolean state so it will show No results found in the specific case
    noResultsFound(noResults)
    showData() // show the data on the table
    changePage(1) // changing to page 1 of the table
}

// function that shows or hide the "No results found" div based on a boolean value
function noResultsFound(noResults) {
    if (noResults) {
        noResultsDiv.style.display = 'flex'
    } else {
        noResultsDiv.style.display = 'none'
    }
}

// keyboard friendly function that runs everytime the user presses a key
function keyPressed(e) {
    userInputSelected = userInput === document.activeElement // check if the user has selected the search field already
    // console.log(e.keyCode)
    if (e.keyCode == 39 && !modalOpened) {
        changePage('next') // Right arrow key - next table page
    } else if (e.keyCode == 37 && !modalOpened) {
        changePage('prev') // Left arrow key - previous table page
    } else if ((e.keyCode == 36 || e.keyCode == 38) && !modalOpened) {
        changePage(1) // Home key - first table page
    } else if ((e.keyCode == 35 || e.keyCode == 40) && !modalOpened) {
        changePage('last') // End key - last table page
    } else if (e.keyCode == 13 && modalOpened) {
        addElement() // Enter key - select the search input
    } else if (e.keyCode == 45) {
        openAddModal() // Insert key - add another element
    } else if (e.keyCode == 27 && userInputSelected) {
        userInput.value = '' // on ESC key if search input is selected it empties its value
        search()
    } else if (e.keyCode == 27) {
        closeModal() // close the modal on ESC key
    } else if (e.keyCode == 70 && !modalOpened && !userInputSelected) {
        setTimeout(focusSearch, 100) // on F key press, focus the search input
    }
}

// add another element functions
function openAddModal() {
    modalOpened = true // assigning the true state for the variable so we can use it later
    formWarn.style.display = "none" // in case we had the empty title warning, now we hide it
    form.style.display = "block"
    fade.style.display = "block"
    form.style.zIndex = 1
    fade.style.zIndex = 1

    // adding classes in order to show the modal with the form and the "fade filter" over the page
    form.classList.add("myFormDispalyed")
    fade.classList.add("pageFadeDisplayed")

    // just preselect the title field, so the user can type directly the title
    titleForm.focus()
}

function focusSearch() {
    userInput.focus()
    userInput.value = ""
}

function addElement() {
    // getting values from the input fields
    const title = titleForm.value
    const descr = descriptionForm.value
    const img = imageForm.value

    //checking if the user inserted any title
    if (title.length > 0) {
        formWarn.style.display = "none"
        // creating an object and assigning it to a variable
        const newElement = {
            title: title,
            description: descr,
            imagePath: img
        }

        // emptying all the input fields in case the user wants to add anothe element
        titleForm.value = ''
        descriptionForm.value = ''
        imageForm.value = ''
        userInput.value = ''

        localRawData.unshift(newElement)

        // calling functions to close the modal and searching again in the table
        // the purpose for this search is to "regenerate" the table with the new data
        closeModal()
        search()
    } else {
        formWarn.style.display = "block"
    }
}

// show or hide the instructions tab
function toggleInstructions() {
    instructions.classList.toggle("instructionsHidden")
}

function goToGit() {
    window.open('https://github.com/ConstantinGuiu/Table-challenge')
}

function closeModal() {
    modalOpened = false // assigning the false state for the variable

    // removing the classes that were displaying the modal
    form.classList.remove("myFormDispalyed")
    fade.classList.remove("pageFadeDisplayed")

    // waiting for the hide animations to finish (opacity from 100% to 0%)
    // then moving the elements behind our content
    setTimeout(200)
    form.style.zIndex = -1
    fade.style.zIndex = -1
}