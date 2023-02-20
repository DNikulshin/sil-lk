const locationHref = window.location.href
const sidebarLink = document.querySelectorAll('.main-menu2-list li a')
sidebarLink.forEach(link => {
    if(link?.href === locationHref) {
       link.classList.add('active-link')
    }
})




