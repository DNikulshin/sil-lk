const locationSearch = window.location.search

const sidebarLink = document.querySelectorAll('.main-menu2-list li a')
sidebarLink.forEach(link => {
    if(link?.href.includes(locationSearch) && locationSearch !== '') {
       link.classList.add('active-link')
    }
})

console.log(locationSearch)


