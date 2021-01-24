import {elements} from './base';

//this funtion renders the shopping list
export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid = ${item.id}>
    <div class="shopping__count">
        <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
        <p>${item.unit}</p>
    </div>
    <p class="shopping__description">${item.ingredient}</p>
    <button class="shopping__delete btn-tiny">
        <svg>
            <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
    </button>
    </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);

} 

//this funtion deletes the particular element
export const deleteItem = id => {
    //this first selects the id of the object
    const item = document.querySelector(`[data-itemid="${id}"]`);
    //then go to just parent and from there it deletes the child
    item.parentElement.removeChild(item);
}