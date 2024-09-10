const unit = 'metric'
const lat = '-33.8625143';
const lon = '18.5191127';
const apiKey = '957232e17ab264b38b2ba06671725843'
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;


let dataArray = []
//let randomData = [1,1,1,1,5,9,4,5,6,8,54,56,4,564,56,89,45,46,8]
let allData = []



function fetchData(){
fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error('Can not connect to API ' + response.statusText);
        }
        return response.json();
    })
    .then(data =>{

        allData.push(data);
        filterData(data)
        console.log('Data fetched:', data)   
        currentState(data)
        displayDataArray(data)
        
    })
    .catch(error =>{
        console.log('Error fetching data: ', error);
    })
}

function refreshFetch(){
    window.setInterval(() =>{
        fetchData()
        console.log('url fetched')
    },60000)

}

function currentState(data){
    let appendCall = document.querySelector('.appendCall');
    appendCall.innerHTML = '';
    
    let newDiv = document.createElement('div');
    newDiv.classList.add('currentState');
    
    newDiv.innerHTML = `
        <ul>
            <li>Location: ${data.name}</li>
            <li>Sea Level: ${data.main.sea_level}</li>
            <li>Current Temperature: ${data.main.temp}</li>
            <li>Max Temperature: ${data.main.temp_max}</li>
            <li>Min Temperature: ${data.main.temp_min}</li>
            <li>Wind Speed: ${data.wind.speed}</li>
            <li>Wind Degrees: ${data.wind.deg}</li>
        </ul>`;
    
    appendCall.append(newDiv);
}

function displayDataArray(){
    console.log('displayDataArray called');
    let arrayList = document.querySelector('.arrayList');
    arrayList.innerHTML = ''

    dataArray.forEach(data => {

    let newDivAr = document.createElement('div');
    newDivAr.classList.add('log-container')
    newDivAr.innerHTML = `
     <ul>
        <li>Location: ${data.name}</li>
        <li>Sea Level: ${data.main.sea_level}</li>
        <li>Current Temperature: ${data.main.temp}</li>
        <li>Max Temperature: ${data.main.temp_max}</li>
        <li>Min Temperature: ${data.main.temp_min}</li>
        <li>Wind Speed: ${data.wind.speed}</li>
        <li>Wind Degrees: ${data.wind.deg}</li>
    </ul>
    `
    arrayList.append(newDivAr)

});


}

function filterData(data){

    for (data of allData) {
        const existData = dataArray.find((item) => 
            item.wind.deg == data.wind.deg ||
            item.wind.speed == data.wind.speed);

        if(!existData){
            console.log("Adding new data to dataArray", data);
            dataArray.push(data)
        }
        else{
            console.log("data matches", data);
        }
        
    }
    
}

//function to set value of pulling data intervals
function dataIntervals(data){

}

//function that checks userInput of geo-location
//function that breaks objects apart into

fetchData()
refreshFetch()


console.log("Filtered data: ", dataArray)
console.log("All data: ", allData)

