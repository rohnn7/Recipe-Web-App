//this will catch the Search class being exported and store it into Search
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchview';
import * as recipeView from './views/recipeview';
import * as listview from './views/listview';
import {elements, renderLoader, clearLoader} from './views/base';


/*global state of the app
*- it will store the search object for a particular session
*- it will store the Current Recipe object for a particular session
*- it will store the shopping list object for a particular session
*- it will store the liked Recipe object for a particular session
*/
const state = {}


/*##########################################################################################
SEARCH CONTROLLER STARTS
*/
//this function will be directly called after hitting the Search
const controlSearch = async () => {
    //1) Get query for view
    const query = searchView.getInput();
    console.log(query);

    if(query){
        //2) create new Search object and add it to state
        state.search = new Search(query);

        //3) prepare UI for resul (spiral loader)
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //4)Search the recipe
        await state.search.getResult();

        //5) Render the result on UI
        clearLoader();        
        searchView.renderResuts(state.search.result);
    }
}

//adding event to Search button
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //it prevents the page to reload after hitting the search
    controlSearch();
})


//This will help to go to different pages onclick
elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        //in we get the goto proprerty and then pass it in renderrResults mapped with page
        //Now since page is changed start and end index for slice is also changed and then 
        //renderResults returns the value according to new start and end indices
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResuts(state.search.result, gotoPage);

    }
});

/*##########################################################################################
SEARCH CONTROLLER ENDS
*/

/*##########################################################################################
RECIPE CONTROLLER STARTS
*/
//47746
// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
    //1)Get ID From url
       //(if u have notice when u click on the particular item in the list the in url i.ie localhost:8000/#somenumbe
       // is added and that number is the id of that. So in JS there is a method to get the particular hash number)
    const id = window.location.hash.replace('#', '');

    if(id){
        //2) Prepare the UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //3)Create new recipe and store in state
        state.recipe = new Recipe(id);

        //4)Get the recipe data
        await state.recipe.getRecipe();
        state.recipe.parseIngridients();

        //5) Calculate the servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //6)Render recipe in UI
         clearLoader();
         recipeView.renderRecipe(state.recipe);
        // 
        console.log(state.recipe);
    }
}


//The above two can be written in one line but before that let me explain what those two those
//First, is an event one the hash number changes on url tab and then calls controlRecipe which gives particular 
//  recipe by id. So, by doing that we dont need to hyperlink any list item just change in id is enough to trigger that
//Second, is an event when page loads again i.e. is refreshed, so this helps to hold the recipe even if the 
//  page is loaded

//hashchange', 'load'].forEach(event => window.addEventListner(event, controlRecipe));
window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

/*##########################################################################################
RECIPE CONTROLLER ENDS
*/

/*##########################################################################################
LIST CONTROLLER STARTS
*/

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    //closest is like an event delegation so we defined our itemid there
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listview.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

const controlList = () => {
    //Create a new list if not yet 
    if(!state.list) state.list = new List();

    //Add each ingredient to List and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listview.renderItem(item);
    });
}

//Here we add an event delegate because those button are not there when the page loads
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button clicked
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);        
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
});

/*##########################################################################################
LIST CONTROLLER ENDS    
*/















