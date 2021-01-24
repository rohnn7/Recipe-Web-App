import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.items = []
    }

    //this funtion adds the items to the array, and an item is an object
    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),//this generates unique id
            count,
            unit,
            ingredient           
        }
        this.items.push(item);
        return item;
    }

    //this method deletes the item from items array
    deleteItem(id){
        //first find the index of the object in items array
        const index = this.items.findIndex(el => el.id === id);
        //splice method effects that array itself unlike slice method which returns copy of new array
        this.items.splice(index,1);
    }

    //this method is used update the COUNT field only
    updateCount(id, newCount){
        //findindex returns an index where as find returns the element at that index
        //when that object is returned its count field is set to new Count
        this.items.find(el => el.id === id).count = newCount;
    }
}