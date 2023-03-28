import Weather from './weatherGet.js'
import Coordinates from './coordinatesGet.js'

const City_current_temp = document.querySelector('.City .current_weather .current_temp')
const City_current_symbol_code = document.querySelector('.City .current_weather .current_symbol_code')

const City_next_six_hours_temp = document.querySelector('.City .next_six_hours_weather .next_six_hours_temp')
const City_next_six_hours_symbol_code = document.querySelector('.City .next_six_hours_weather .next_six_hours_symbol_code')

async function main() {
    const City_Coordinates = await Coordinates(city_name)

    console.log("BOB:" + City_Coordinates);

    const City = new Weather(City_Coordinates[0], City_Coordinates[1])
    City.fetchWeather()
    .then(()=>{
        City_current_symbol_code.innerText = City.get_current_Weather_symbol_code()
        City_current_temp.innerText = City.get_current_Weather_air_temperature()
        if (City_current_temp.innerText < 0) {
            City_current_temp.style.color = "blue"
        }
        else if(City_current_temp.innerText > 0){
            City_current_temp.style.color = "red"
        }


        City_next_six_hours_symbol_code.innerText = City.get_next_6_hours_Weather_symbol_code()
        City_next_six_hours_temp.innerText = City.get_next_6_hours_Weather_air_temperature()
        if (City_next_six_hours_temp.innerText < 0) {
            City_next_six_hours_temp.style.color = "blue"
        }
        else if(City_next_six_hours_temp.innerText > 0){
            City_next_six_hours_temp.style.color = "red"
        }
    })
}
main()

// Manages the search box and search button
const search = document.querySelector('.searchButton')
const searchIn = document.querySelector('#searchInput')

search.addEventListener('submit', (e)=>{
    e.preventDefault()
    location.assign('/weather/' + searchIn.value)
})