let dataArray = []
let allData = []

let currentIntervalId = null;

function fetchData(url){
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
    //console.log('displayDataArray called');
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
        const existData = dataArray.find((item) => item.wind.speed === data.wind.speed 
        || item.wind.deg === data.wind.deg 
        || Number(item.main.temp) === Number(data.main.temp)
        || Number(item.main.temp_max) === Number(data.main.temp_max)
        || Number(item.main.temp_min) === Number(data.main.temp_min)
        );
    
        if(!existData){
            dataArray.push(data)
        }
    }
    
    
}

//Create Interval Input function
function initializeIntervalControl(){
    
    let dataColEl = document.querySelector('.col-interval')
    let interval = ['Select','Seconds','Minutes','Hours']

    const locationSelect = coLocationEl();
    dataColEl.append(locationSelect);

    let intervalInputEl = document.createElement('input');
    intervalInputEl.setAttribute('type','text')
    intervalInputEl.classList.add('interval-input')

    intervalInputEl.onkeydown = function(event){
        if(isNaN(event.key) && event.key !== 'Backspace'){
            event.preventDefault();
        }

        const selectedOption = locationSelect.options[locationSelect.selectedIndex];
        const lat = selectedOption.getAttribute('data-lat');
        const lon = selectedOption.getAttribute('data-lon');

        if(lat && lon){
            const apiKey = '957232e17ab264b38b2ba06671725843'
            const unit = 'metric'
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
            console.log(url)
            
            fetchData(url);
        }

        
    };
    
    let intervalSelectEl = document.createElement('select');
    intervalSelectEl.classList.add('select-interval')
    
    //for loop to create options from Interval array
    for(let i = 0; i < interval.length; i++){
        let intervalOptiontEl = document.createElement('option');
        intervalOptiontEl.innerHTML = `${interval[i]}`
        intervalSelectEl.append(intervalOptiontEl);
    }

    let intervalBtnEl = document.createElement('button');
    intervalBtnEl.classList.add('interval-Btn')
    intervalBtnEl.innerText = 'Set Data Interval'

    

    dataColEl.append(intervalInputEl);
    dataColEl.append(intervalSelectEl);
    dataColEl.append(intervalBtnEl);
}

initializeIntervalControl()

//Create Location selection function
function coLocationEl(){

    let coordinates = [
        {name: 'Montague',lat: '-33.8625143',lon: '18.5191127'},
        {name: 'Bothasig',lat: '-33.8613841',lon: '18.5318508'},
        {name: 'Piketberg',lat: '-32.9140505',lon: '18.7550459'},
        {name: 'Diep River',lat: '-34.0496244',lon: '18.4434611'},
        {name: 'Goodwood',lat: '-33.9076068',lon: '18.5003416'}
    ];

    let dataColEl = document.querySelector('.col-interval')
    let coInput = document.createElement('select')


    for (let i = 0; i < coordinates.length; i++) {
        const coordinateEl = coordinates[i];
        let locationOptiontEl = document.createElement('option')
        locationOptiontEl.append(coordinateEl.name)
        locationOptiontEl.setAttribute('data-lat', coordinateEl.lat);
        locationOptiontEl.setAttribute('data-lon', coordinateEl.lon);
        coInput.append(locationOptiontEl)
    }
    
    return coInput
    
}

const intervalLookup = {
    Seconds: 1000,
    Minutes: 60000,
    Hours: 60 * 60 * 1000,
}

const input = document.querySelector('.interval-input');
const select = document.querySelector('.select-interval');
const button = document.querySelector('.interval-Btn');

function isValidInterval(intervalValue, selectedInterval){
    if (!intervalValue && !selectedInterval) {
        alert('Please provide numeric value and select interval type');
        return false;
      } else if (!intervalValue) {
        alert('Please provide numeric value for interval');
        return false;
      } else if (!selectedInterval) {
        alert('Please select interval type');
        return false;
      }
      return true;
}

const setupIntervalButton = (input,select,button) =>{
    //console.log('Setting up event listener');
    //console.log('Button elements inside setup:', button);

    button.addEventListener('click', () =>{
    const intervalValue = input.value;
    const selectedInterval = select.value;

    //validation check
    if(!isValidInterval(intervalValue, selectedInterval)) return;

    if(fetchInterval){
        clearInterval(fetchInterval);
        console.log('Previous interval cleared')
    }

    const intervalMilliseconds = intervalValue * (intervalLookup[selectedInterval] || 1000);
    console.log('Interval in milliseconds:', intervalMilliseconds);

    refreshFetch(intervalMilliseconds);
    
    });
}

const setupDynamicIntervalChange = (input, select, button) => {

    

    const stopFetching = () => {
        if (currentIntervalId) {
            clearInterval(currentIntervalId);
            console.log('Data fetching stopped.');
            currentIntervalId = null;  // Reset the interval ID
        }
    };

    const startFetching = (intervalMilliseconds) => {
        currentIntervalId = setInterval(() => {
            fetchData();
            console.log('Data fetched at interval:', intervalMilliseconds);
        }, intervalMilliseconds);
        console.log('Data fetching started at interval:', intervalMilliseconds);
    };

    const updateInterval = () => {
        const intervalValue = parseInt(input.value, 10);
        const selectedInterval = select.value;

        // Validate input
        if (isNaN(intervalValue) || !intervalLookup[selectedInterval]) {
            //console.log('Invalid input or selection. Interval not updated.');
            return;
        }

        const intervalMilliseconds = intervalValue * intervalLookup[selectedInterval];
        console.log('New interval in milliseconds:', intervalMilliseconds);

        // Stop fetching if already running
        stopFetching();

        // Start fetching with new interval
        startFetching(intervalMilliseconds);
    };

    // Event listeners to handle changes
    input.addEventListener('change', updateInterval);
    select.addEventListener('change', updateInterval);

    // Also set the interval when the button is clicked
    button.addEventListener('click', updateInterval);
};

setupDynamicIntervalChange(input,select,button);

