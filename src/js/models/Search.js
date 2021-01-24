
/* axios works same as fetch...Since fetch was not supported in many browsers therefore we are using axios
unlike fetch, axios automatically returns the json format */
import axios from 'axios';

//Here we are exporting the class that will help us Search thhrough APi
export default class Search{
    constructor(query){
        //query will be the text we entered in the search bar 
        this.query = query;
    }
    //`https://forkify-api.herokuapp.com/api/search?&q=${query}`
    //this method will be called when the search button would be hit
    async getResult(){
        try{        
            //this API returns the json format of data, with query as an parameter            
            const result =  await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            //after the getResult funtion will be called, a new property 'result' will be made
            //and this property stores the all recipe from whole data returned
            this.result = result.data.recipes;
            //console.log(this.result);
        }catch(error){
            alert(error);
        }
    }
}