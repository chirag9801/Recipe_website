let add_ingredients = document.getElementById('add_ingredients');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];

add_ingredients.addEventListener('click',function(){
    let new_ingredients= ingredientDiv.cloneNode(true);
    let input = new_ingredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientList.appendChild(new_ingredients);
});






