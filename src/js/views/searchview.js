import {elements} from './base';

//this function is for taking the input from search box
export const getInput = () => document.querySelector('.search__field').value;

//this will clear the past text
export const clearInput = () => {
    elements.searchInput.value = ''
}

//this will clear the results in the results bar
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

//this funtion will limit the title length
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

//this function will be called in the foreach method, which will dispay each recipe as the list item
const renderRecipe = recipe => {
    const markup ='<li><a class="results__link results__link--active" href="#'+recipe.recipe_id+'"><figure class="results__fig"><img src="'+recipe.image_url+'" alt="Test"></figure><div class="results__data"><h4 class="results__name">'+limitRecipeTitle(recipe.title) +'</h4><p class="results__author">'+recipe.publisher+'</p></div></a></li>';
    elements.searchResList.insertAdjacentHTML('beforeend', markup);    
};

const createButton = (page, type) => `
     <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'?page-1:page+1}>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev'?'left':'right'}"></use>
            </svg>
        <span>${type === 'prev'?page-1:page+1}</span>
    </button>
`;


//this function will add buttons to the page Also sees which oage it is and sets the button
const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);//calculating number of pages

    let button;
    if(page === 1 && pages > 1){
        //Only one button to go to next page
        button = createButton(page, 'next');
    }else if(page<pages ){
        //both button next and previous
        button=`
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }else if(page === pages && pages > 1){
        //only one button to go to previos page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

//this will dispay the whole list of the results
//page parameter represents the current page
//resPerPage reperesents the amount of result in each page
export const renderResuts = (recipes, page=1, resPerPage=10) => {
    
    //end and start are the indexes for each result on each page
    //suppose page is 1 then start = 0*10=0 end=1*10=10
    const start = (page-1)*resPerPage;
    const end = page*resPerPage;
    
    //slice method returns of copy of array from specified index to specified index
    recipes.slice(start, end).forEach(renderRecipe);

    //Now Add the button for next or prev page
    renderButton(page, recipes.length, resPerPage);
}