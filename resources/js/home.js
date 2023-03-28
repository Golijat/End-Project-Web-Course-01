import Weather from './weatherGet.js'
import coordinates from './coordinatesGet.js'

const arr = ['Kil', 'Karlstad']
const obj = []

for (let index = 0; index < arr.length; index++) {
    console.log(index);
    const coord = await coordinates(arr[index])
    const City = new Weather(coord[0], coord[1])
    await City.fetchWeather()
    const current_temp = City.get_current_Weather_air_temperature()
    const current_symbol_code = City.get_current_Weather_air_temperature()
    const next_six_temp = City.get_next_6_hours_Weather_air_temperature()
    const next_six_symbol_code = City.get_next_6_hours_Weather_air_temperature()
    const bob = {
        name: arr[index],
        current_temp: current_temp,
        current_symbol_code : current_symbol_code ,
        next_six_hours_temp: next_six_temp,
        next_six_hours_symbol_code: next_six_symbol_code
    }
    obj.push(bob)
}
console.log(obj);

let x = 1
const City_current_temp = document.querySelector(`.city${x} .current_weather .current_temp`)
const City_current_symbol_code = document.querySelector(`.city${x} .current_weather .current_symbol_code`)

const City_next_six_hours_temp = document.querySelector(`.city${x} .next_six_hours_weather .next_six_hours_temp`)
const City_next_six_hours_symbol_code = document.querySelector(`.city${x} .next_six_hours_weather .next_six_hours_symbol_code`)


const City = new Weather(59.516667, 13.8)
City.fetchWeather()
.then(()=>{
    console.log(City.get_current_Weather_air_temperature());

    City_current_symbol_code.innerText = City.get_current_Weather_symbol_code()
    City_current_temp.innerText = City.get_current_Weather_air_temperature()
    // Makes the color of the temperature text blue if it is below 0 and red if it is above 0, if the weather is 0 degrees then the color does not change.
    if (City_current_temp.innerText < 0) {
        City_current_temp.style.color = "blue"
    }
    else if(City_current_temp.innerText > 0){
        City_current_temp.style.color = "red"
        console.log("Current Test");
    }


    City_next_six_hours_symbol_code.innerText = City.get_next_6_hours_Weather_symbol_code()
    City_next_six_hours_temp.innerText = City.get_next_6_hours_Weather_air_temperature()
    if (City_next_six_hours_temp.innerText < 0) {
        City_next_six_hours_temp.style.color = "blue"
        console.log("Test1");
    }
    else if(City_next_six_hours_temp.innerText > 0){
        City_next_six_hours_temp.style.color = "red"
        console.log("Test2");
    }
    console.log("Test3");
})

// Manages the search box and search button
const search = document.querySelector('.searchButton')
const searchIn = document.querySelector('#searchInput')

search.addEventListener('submit', (e)=>{
    e.preventDefault()
    location.assign('/weather/' + searchIn.value)
})