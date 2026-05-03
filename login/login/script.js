const form = document.querySelector("#form");
const campo = document.querySelector("#n1");

form.addEventListener('submit', function(event){
    event.preventDefault() 
    const input = campo.value

    console.log(input);
})