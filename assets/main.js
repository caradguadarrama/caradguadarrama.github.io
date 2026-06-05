// wellcome text
const logo = document.querySelector('.logo');

const lang = ["Hello World", "Hola Mundo", "ハロー・ワールド"];

let i = 0;

setInterval(() => {
    i = (i + 1) % lang.length;
    logo.textContent = lang[i];
}, 2000);

