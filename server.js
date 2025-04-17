// Hier importeer ik het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
// Ook importeer ik LiquidJS, een template engine die ik ga gebruiken om HTML te genereren
import express from 'express'
import pkg from 'liquidjs'

const { Liquid } = pkg

// Hier definieer ik de API URL's, waar ik data vandaan wil halen, stekjes en stekjeskast-afbeeldingen
const apiUrl = "https://fdnd-agency.directus.app/items/bib_stekjes";
const afbeeldingenUrl = "https://fdnd-agency.directus.app/items/bib_afbeeldingen?filter={%20%22type%22:%20{%20%22_eq%22:%20%22stekjes%22%20}}";

// Hier maak ik een nieuwe Express app aan
const app = express()

// Hier stel ik de view engine in op Liquid, en geef ik de map op waar de templates staan
const engine = new Liquid()
app.engine('liquid', engine.express())
app.set('views', './views')
app.set('view engine', 'liquid')

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
app.use(express.static('public'))
// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Get route voor de overzichtspagina van de stekjes
app.get('/', async (req, res) => {
// Hier doe ik een FETCH naar de API URL om de stekjesdata op te halen
   const stekjesResponse = await fetch(apiUrl);
   // Hier wordt de response omgezet naar JSON
   const stekjesResponseJSON = await stekjesResponse.json();

// Hier doe ik een FETCH naar de API URL om de stekjeskast-afbeeldingen op te halen
   const afbeeldingenResponse = await fetch(afbeeldingenUrl);
    // Hier wordt de response omgezet naar JSON
   const afbeeldingenResponseJSON = await afbeeldingenResponse.json();

// Hier render ik de index.liquid template, en geef ik de data van de API mee
  res.render('index.liquid',{
      stekjes: stekjesResponseJSON.data,
      afbeeldingen: afbeeldingenResponseJSON.data,
    }
  ) 
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