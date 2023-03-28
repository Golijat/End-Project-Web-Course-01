async function coordinatesGet(city){
    let geo = await fetch(`https://geocode.maps.co/search?q=${city}`)

    let which_city = 0
    // which_city is used in a loop that checks the results that come back from the api, because the first result is not always
    // the one that is correct, the loop will go through the information and check if one object has the correct name in it
    // and is located in Sweden.
    geo = await geo.json()

    if(geo == false){
        console.log("Geo är tom");
        return "empty"
    }
    while (true) {
        // if(city && "Sweden" in geo[which_city].display_name){
        if(geo[which_city].display_name.includes(city)){
            if(geo[which_city].display_name.search("Sweden")){
                // console.log("Found it");
                // console.log(geo[which_city].display_name);
                break
            }
        }
        else{
            which_city++
            // console.log("Did not find it");
        }
    }

    const lat = Number(geo[which_city].lat)
    const lon = Number(geo[which_city].lon)

    return [lat, lon]
}

export default coordinatesGet