function submitLike(event) {
    // Voorkom dat het formulier de pagina ververst
    event.preventDefault();

    // Haal het ingediende formulier op
    const form = event.target;
  
    // Zoek de knop en zijn onderdelen
    const button = form.querySelector('button');           // de verzendknop
    const tekstElement = button.querySelector('.button-text'); // de tekst in de knop
    const laadAnimatie = button.querySelector('.loader');  // de loader animatie
  
    // Zet de UI in loading state
    button.disabled = true; // knop uitschakelen
    tekstElement.hidden = true; // tekst verbergen
    laadAnimatie.hidden = false; // loader tonen
  
    // Verstuur de POST verzoek
    fetch(form.action, { method: 'POST' })
      // Bij succes, toon een groene melding
      .then(function() {
        toonMelding("✅ Stekje toegevoegd aan favorieten!", false);
      })
      // Bij fout, toon een rode melding
      .catch(function() {
        toonMelding("⚠️ Er ging iets mis bij het toevoegen", true);
      })
      // In alle gevallen, zet de knoppen en teksten weer terug
      .finally(function() {
        button.disabled = false;     // knop weer inschakelen
        tekstElement.hidden = false; // tekst weer tonen
        laadAnimatie.hidden = true;  // loader verbergen
      });
  }

