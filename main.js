getData() // calling the main function to get the JSON

let currentPage = 1 // default page of the table set to 1
let totalPages // will assign a number of pages based on how much data needs to be shown
let perPage = document.getElementById("perPage").value // will be used to show how many items will be shown on the table at once
let localData // just a variable to keep the received data from the JSON

// creating an async function to get the data from the JSON
async function getData() {
    const response = await fetch("data.json")
    let data = await response.json();
    processData(data)
}

function processData(data) {
    // saving data from the JSON to a global variable in order to access it later
    localData = data
    showData()
    addPageButtons()
    changePage(1)
}

function showData() {
    let data = []
    for (i in localData) {
        data.push(localData[i])
    }
    // calculating the number of pages
    totalPages = Math.ceil(data.length / perPage)

    // keeping in the local data variable only the elements that needs to be shown
    let elementsToRemove = (currentPage - 1) * perPage
    data.splice(0, elementsToRemove)
    data.splice(perPage)

    processTable(data)
}

function changePerPage(x) {
    perPage = document.getElementById("perPage").value
    showData()
    addPageButtons()
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
    imageHeader.innerHTML = "Image"

    // appending table headers to the table row
    thr.appendChild(titleHeader)
    thr.appendChild(descrHeader)
    thr.appendChild(imageHeader)

    // appending table row to the table tag from HTML
    table.appendChild(thr)

    for (i in data) {
        let tr = document.createElement("tr");
        let title = document.createElement('td')
        let descr = document.createElement('td')
        let imgDiv = document.createElement('td')

        title.innerHTML = data[i].title
        descr.innerHTML = data[i].description

        let img = document.createElement('img')
        img.src = data[i].imagePath
        imgDiv.appendChild(img)

        tr.appendChild(title)
        tr.appendChild(descr)
        tr.appendChild(imgDiv)
        table.appendChild(tr)
    }
}

// add buttons based on how many pages there are
function addPageButtons(){
    let allBtns = document.getElementById('allBtns')
    allBtns.innerHTML = ''  // first remove all the previous buttons (if any)
    for(i=1; i<=totalPages; i++){
        let btn = document.createElement("button")  // create a button element
        btn.setAttribute('onclick', `changePage(${i})`) // give the attribute for onclick to call the "changePage()" function
        btn.innerHTML = i   // also the text of the button
        allBtns.appendChild(btn)    // append the button to the buttons div in HTML
    }
    changePage(1)
}

// a function that changes the pages of the table based on a value
function changePage(x) {
    if (x === 'prev') { // if the value is equal to 'prev'
        currentPage-- // it subtracts 1 from the currentPage variable
    } else if (x === 'next') { // if the value is equal to 'next'
        currentPage++ // it adds 1 from the currentPage variable
    } else if (x === 'last') { // if the value is equal to 'next'
        currentPage = totalPages // it adds 1 from the currentPage variable
    } else if (typeof x == "number") { // if the value is equal to 'next'
        currentPage = x // it adds 1 from the currentPage variable
    }

    stylePageBtns()
    showData()
}

function stylePageBtns(){
    // check if user is on the first or last page
    // so those buttons will be disabled
    
    let frontState = false
    let endState = false
    
    if (currentPage === 1) {
        frontState = true
    } else if (currentPage === totalPages) {
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
    for(i=0; i<numberedBtns.length; i++){
        if(i==currentPage-1){
            numberedBtns[i].classList.add('selectedBtn')
        } else{
            numberedBtns[i].classList.remove('selectedBtn')
        }
    }

}