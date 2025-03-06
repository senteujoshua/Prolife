document.addEventListener("DOMContentLoaded", function(){
    document.getElementsById("menu").addEventListener('click', function(){
        const nav = document.getElementById('nav')
        nav.classList.add('show')
    })

})
