// Zoek alle links met data-scroll-target
const scrollLinks = document.querySelectorAll('a[data-scroll-target]')

// Voor elke link...
scrollLinks.forEach(link => {
 // ...als erop geklikt wordt
  link.addEventListener('click', event => {
 // Stop standaard gedrag (springen)
  event.preventDefault()
 // Haal de selector uit het attribuut
  const selector = link.getAttribute('data-scroll-target')
 // Zoek het doel element
  const target = document.querySelector(selector)
    // Scroll er vloeiend naartoe
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  })
})