import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    //this method calls the API for the particular Recipe and this then makes other fields to store neccesssary informations
    //This method will be called when we click a particular Recipe in the list
    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            alert(error);            
        }
    }

    //This method calculates the amount of time required to cook a recipe
    //here we took a rough estimate by making some assumptions 
    calcTime(){
        //Assuming that we need 15 min for each 3 ingredients 
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods*15;
    }

    //this method is resposible for amount of serving
    //through this method we can plus or minus the amount of servings
    calcServings(){
        this.servings = 4;
    }

    //This method basically seperates the units, number and strings from ingridients, because ingridiends
    //return all together as string, so in this function we made that one string at that index
    // into object which contain Unit, Count and ingridient
    //1)Count: it contain the number part of string
    //2)Unit: it contain the units part of strings (like cups , teaspoons etc..)
    //3)Ingridient: it contain the ingridient part of string
    parseIngridients(){        
        //These two arrays contain all units and second array contain the short form of each respectively
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        //this.ingredients is an array and map funtion returns new array by traversing by forEach and that new arraw
        //is stored in newIngridients
        const newIngridients = this.ingredients.map(el => {
            //1) Uniform Units
            //first step is to convert all units to short form
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) => {
                //unit maps elemet and i maps index
                //so in that string if any element from UnitsLong array replace it with UnitsShort element 
                //at same index 
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2) Remove Paranthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');//we split each element in array
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));//it finds and return index if found and if not then -1

            let objIng;
            if(unitIndex>-1){
                //There is a Unit That also means a number at first place
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                //we slice the array from start until unitIndex(until a unit is found)
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                //in some strings it is like 4-1/2 cups so it is treated as one
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));                    
                }else{
                    count = eval(arrIng.slice(0, unitIndex)).join('+');
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            }else if(parseInt(arrIng[0], 10)){
                //There is NO unit but 1st element is a number 
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                //There is NO unit and NO number at first place
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngridients;
         
    }

    //It update the servings along with the count of ingredients
    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ?this.servings-1:this.servings+1;

        //Ingridients
        //we use foreach loop to traverse the ingredients array and set the counts relative new value
        this.ingredients.forEach(ing => {
            ing.count *= (newServings/this.servings);
        });

        this.servings = newServings;
    }
}

















