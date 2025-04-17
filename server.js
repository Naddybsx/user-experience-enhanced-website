// Hier importeer ik het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
// Ook importeer ik LiquidJS, een template engine die ik ga gebruiken om HTML te genereren
import express from 'express'
import pkg from 'liquidjs'

const { Liquid } = pkg

// Hier maak ik een nieuwe Express app aan
const app = express()
const engine = new Liquid()

// Hier stel ik de Liquid template engine in als view engine
app.set('views', './views')
app.set('view engine', 'liquid')

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
app.use(express.static('public'))
// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Get route voor de overzichtspagina van de stekjes
app.get('/stekjes', async (req, res) => {
  res.render('index.liquid')
})

// GET route voor de detailpagina van een stekje
app.get('/stekje/:id', async (req, res) => {
  res.render('stekje.liquid')
})

// POST route voor het liken van een stekje
app.post('/stekje/:id', async (req, res) => {
res.redirect(303, '/')
})

// Hier stel ik de poort in waarop de app draait, en start ik de server
app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), () => {
  console.log(`✅ App draait op http://localhost:${app.get('port')}`)
})