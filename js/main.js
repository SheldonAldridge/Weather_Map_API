const unit = 'metric'
const lat = '-33.8625143';
const lon = '18.5191127';
const apiKey = '957232e17ab264b38b2ba06671725843'
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;


let dataArray = []

function fetchData(){
fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error('Can not connect to API ' + response.statusText);
        }
        return response.json();
    })
    .then(data =>{
        
        dataArray.push(data)
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
    },5000)

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
        </ul>
    `;
    
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

fetchData()
refreshFetch()

console.log(dataArray)