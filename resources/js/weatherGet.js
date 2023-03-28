// weatherGet(59.516667, 13.8, 1)

class WeatherGet{
    constructor(lat, lon){
    this.lat = lat
    this.lon = lon
    this.current_air_temperature = 0
    this.current_symbol_code = "nothing"
    this.next_6_hours_air_temperature = 0
    this.next_6_hours_symbol_code = "nothing"
    // yr.no' api uses symbol code to identify what the weather is going to be.
    // for example, raning, heavy raining.
    }

    async fetchWeather(){
        let yr = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${this.lat}&lon=${this.lon}`, {
            headers: {
                "User-Agent": "Weather For You"
            }
        })
    // Information is being fetched from yr.no's api. A header is sent with to indentify where it is being fetched from.
    // Something that was needed according to their terms of service.
    // the latitude and longitude is sent with in order to get weather information for a specific place.

        yr = await yr.json()
        this.current_air_temperature = yr.properties.timeseries[1].data.instant.details.air_temperature
        this.current_symbol_code = yr.properties.timeseries[1].data.next_1_hours.summary.symbol_code

        this.next_6_hours_air_temperature = yr.properties.timeseries[1].data.next_6_hours.details.air_temperature_min
        this.next_6_hours_symbol_code = yr.properties.timeseries[1].data.next_6_hours.summary.symbol_code
    }
    // async fetchWeather_next_6_hours(){
    //     let yr = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${this.lat}&lon=${this.lon}`, {
    //         headers: {
    //             "User-Agent": "Weather For You"
    //         }
    //     })
    //     // The same thing for getWeather_current() is being done here, except that its getting the weather information for the
    //     // next six hours.
    //     yr = await yr.json()
    //     this.next_6_hours_air_temperature = yr.properties.timeseries[1].data.next_6_hours.details.air_temperature_min
    //     this.next_6_hours_symbol_code = yr.properties.timeseries[1].data.next_6_hours.summary.symbol_code
    // }

    get_current_Weather_air_temperature(){
        return this.current_air_temperature
    }
    get_current_Weather_symbol_code(){
        return this.current_symbol_code
    }

    get_next_6_hours_Weather_air_temperature(){
        return this.next_6_hours_air_temperature
    }
    get_next_6_hours_Weather_symbol_code(){
        return this.next_6_hours_symbol_code
    }

}
export default WeatherGet
