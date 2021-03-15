getData()

async function getData(){
    const response = await fetch("data.json")
    let data = await response.json();
    showData(data)
}

function showData(data){
    console.log(data)
}