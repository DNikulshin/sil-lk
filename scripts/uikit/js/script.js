const locationSearch = window.location.href
const sidebarLink = document.querySelectorAll('.main-menu2-list li a')
sidebarLink.forEach(link => {
    if(link?.href === locationSearch) {
       link.classList.add('active-link')
    }
})


