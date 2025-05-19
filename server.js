//-------------------------------------------------------------------------------------------------------------------//
// Hier importeer ik het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
// Ook importeer ik LiquidJS, een template engine die ik ga gebruiken om HTML te genereren
import express from 'express'
import pkg from 'liquidjs'

const { Liquid } = pkg

// Hier definieer ik de API URL's, waar ik data vandaan wil halen, stekjes en stekjeskast-afbeeldingen
const url = "https://fdnd-agency.directus.app/items/";
const apiUrl = url + "bib_stekjes?fields=*,foto.id,foto.width,foto.height";
const afbeeldingenUrl = url + "bib_afbeeldingen?filter={\"type\":{\"_eq\":\"stekjes\"}}&fields=*,foto.id,foto.width,foto.height";

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
//--------------------------------------------------------------------------------------------------------------------//

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
  // Hier haal ik het stekje op met het juiste ID
  const stekjeId = req.params.id;
  // Hier doe ik een FETCH naar de API URL, met het ID van het stekje
  const stekjeResponse = await fetch(`${url}bib_stekjes/${stekjeId}?fields=*,foto.id,foto.width,foto.height`);
  // Hier wordt de response omgezet naar JSON
  const stekjeData = await stekjeResponse.json();
  
// Hier render ik de stekjes.liquid template, en geef ik de data(stekje) van de API mee
  res.render('stekje.liquid', {
    stekje: stekjeData.data,
  })

})

// POST route voor het liken van een stekje
// Hier maak ik een POST route aan voor het liken van een stekje
app.post('/stekje/:id', async function (request, response) {
    // Hier haal ik het ID uit de URL
    const stekjeId = request.params.id;
    // Dit is hardcoded mijn eigen user ID
    const userId = 4;
    
    // Hiermee check ik of een stekje al is geliked door mij als user, zodat ik kan bepalen of ik een like wil toevoegen of verwijderen
    const userstekjeEntry = await fetch(`https://fdnd-agency.directus.app/items/bib_users_stekjes?filter={"bib_stekjes_id":${stekjeId},"bib_users_id":${userId}}`)
    const userstekjeEntryJSON = await userstekjeEntry.json()
    
    // Als de like al bestaat → verwijder de like (unlike)
    
    if (userstekjeEntryJSON.data.length != 0) { // Als de like al bestaat, dan is de lengte van de array niet 0
      await fetch(`https://fdnd-agency.directus.app/items/bib_users_stekjes/${userstekjeEntryJSON.data[0].id}`, { // Ik doe een fetch naar de koppeltabel waar ik mijn likes wil verwijderen
        method: 'DELETE' // Met delete wil ik een like verwijderen uit de database, dus ik gebruik de DELETE methode
      });
    } else {
      // Als de like nog niet bestaat → voeg de like toe en verstuur een POST naar de koppeltabel om de like op te slaan
    
     await fetch('https://fdnd-agency.directus.app/items/bib_users_stekjes', {  // Ik doe een fetch naar het koppeltabel waar ik mijn likes wil opslaan
        method: 'POST',  // Met post wil ik een like toevoegen aan de database, dus ik gebruik de POST methode
        headers: {   // Met headers weet de server dat ik JSON data ga sturen
          'Content-Type': 'application/json' 
        },
    // De inhoud van de post(like) voeg je toe in de body
    // Hier maak ik twee objecten aan, bib_users_id en bib_stekjes_id
        body: JSON.stringify({
          bib_users_id: userId, // Wie liked? (bib_users_id)
          bib_stekjes_id: stekjeId // Welk stekje wordt geliked? (bib_stekjes_id)
    // Met request.params.id worden de waarden dynamisch ingevuld
        })
      });
    }
      // Stuurt de gebruiker terug naar de detailpagina van het stekje
      response.redirect(303, `/stekje/${stekjeId}`);
    });

//--------------------------------------------------------------------------------------------------------------------//
// Hier stel ik de poort in waarop de app draait, en start ik de server
app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), () => {
  console.log(`✅ App draait op http://localhost:${app.get('port')}`)
})