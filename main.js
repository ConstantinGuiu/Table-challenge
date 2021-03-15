getData() // calling the main function to get the JSON

let currentPage = 1 // default page of the table set to 1
let totalPages // will assign a number of pages based on how much data needs to be shown
let perPage = document.getElementById("perPage").value // will be used to show how many items will be shown on the table at once
let localData // just a variable to keep the received data from the JSON

// creating an async function to get the data from the JSON
async function getData(){
    const response = await fetch("data.json")
    let data = await response.json();
    processData(data)
}

function processData(data){
    // saving data from the JSON to a global variable in order to access it later
    localData = data
    showData()
}

function showData(){
    let data = []
    for(i in localData){
        data.push(localData[i])
    }
    // calculating the number of pages
    totalPages = Math.ceil(data.length/perPage)

    // keeping in the local data variable only the elements that needs to be shown
    let elementsToRemove = (currentPage-1)*perPage
    data.splice(0,elementsToRemove)
    data.splice(perPage)

    processTable(data)
}

function changePerPage(x){
    perPage = document.getElementById("perPage").value
    showData()
}

function processTable(data){
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

    for(i in data){
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