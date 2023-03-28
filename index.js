const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const methodOverride = require('method-override')
const axios = require('axios'); //For API fetching
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('resources'))
app.use(methodOverride('_method'))
app.use(cookieParser())

// bcrypt hashing function
function hash(password){
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

mongoose.connect(process.env.MONGODBADRESS)

const WeatherSchema = new mongoose.Schema({
    city_name: String,
    current: {type:Object, default:{}},
    in_1_hour: {type:Object, default:{}},
    tomorrow: {type:Object, default:{}}
})
const Weather = mongoose.model('weather', WeatherSchema)

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    user_pic: {type:String, default: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.eyhIau9Wqaz8_VhUIomLWgHaHa%26pid%3DApi&f=1&ipt=07417e3ce68c7cbf18e0aaaa79a848f700a2b524be8d23aa5688da55b2530139&ipo=images'}
})
const User = mongoose.model('user', UserSchema)


//GET
app.get('/', (req,res)=>{
    res.render("home")
})

app.get('/user-home', (req,res)=>{
    User.find({}, (error, data)=>{  //Vi använder .find() för att hitta information om användare, ren information.
        if(error){
            console.log(error);
            res.send('An error has occured')
        }else{
            if(req.cookies.login){
                User.findById(req.cookies.login, (error, user)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        res.render("user-home", {data:data, user:user, login: true})
                    }
                })
            }
            else{
                res.render("user-home", {data:data, login:false})
            }
            
        }
    })
})

app.get('/weather/:city_name', (req,res)=>{
    res.render('show', {data:req.params.city_name})
})

// Renders creation page for a new user.
app.get('/new', (req,res)=>{
    res.render('new')
})

app.get('/user/:id/edit', (req,res)=>{
    User.findById(req.params.id, (error, data)=>{
        if(error){
            console.log(error);
            res.send('error')
        }else{
            res.render('edit', {data:data})
        }
    })
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/logout', (req,res)=>{
    req.cookies.login = false
    res.redirect('/user-home')
})

app.get('/user/:id', (req,res)=>{
    User.findById(req.params.id, (error, data)=>{
        if(error){
            console.log(error);
            res.send('error')
        }else{
            res.render('user-page', {data:data, login_cookie:req.cookies.login, color_cookie:req.cookies.color})
            // Om man har loggat in som en användare, så finns en cookie sparad. Här skickas den med.
        }
    })
})

// POST

// Creates a new user
app.post('/create', (req,res)=>{
    if(req.body.user_pic === ""){
        User.create({
            username: req.body.username,
            password: hash(req.body.password),
            // Använder hash funtionen för att hasha lösenordet innan det skickas in i data basen.
        })
    }
    else{
        User.create({
            username: req.body.username,
            password: hash(req.body.password),
            // Använder hash funtionen för att hasha lösenordet innan det skickas in i data basen.
            user_pic: req.body.user_pic
        })
    }
    res.redirect('/user-home')
})

app.post('/login', async (req,res)=>{
    User.find({username: req.body.username},async (error, data)=>{
        if(error){
            console.log(error);
            res.send("error")
        }else{
            for (i in data){
                if(await bcrypt.compareSync(req.body.password, data[i].password)){
                    res.cookie('login',data[i].id, {maxAge: 1000*60*10})
                    // Om man loggar in så sparas en kaka av namnet login, där idet av användaren som loggade in sparas.
                    res.redirect("/user/"+data[i].id)
                    return
                }
            }
            res.send("incorrect login data")
        }
    })
    
})

// EDIT ROUTES
app.put('/user/:id', async (req, res)=>{
    if(req.body.password === ""){
        await User.findByIdAndUpdate(req.params.id, {
            username: req.body.username,
            hex_color: req.body.hex_color,
            user_pic: req.body.user_pic
        })
    }else{
        await User.findByIdAndUpdate(req.params.id, {
            username: req.body.username,
            password: hash(req.body.password),
            // Använder hash funktionen för att hasha det nya lösenordet.
            hex_color: req.body.hex_color,
            user_pic: req.body.user_pic
        })
    }
    res.redirect('/user/'+ req.params.id)
})

// DELETE
app.delete('/user/:id', async (req, res)=>{
    await User.findByIdAndDelete(req.params.id)
    res.redirect('/user-home')
})

// LISTENER
app.listen(3000, (error)=>{
    if(error){
        console.log(error);
    }else{
        console.log('ACCESS ACCEPTED');
    }
})