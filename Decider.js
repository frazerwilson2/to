export class Decider {
    constructor(locations, callback){
        this.locations = locations;
        this.logs = {};
        this.callback = callback;
    }
    logMsg(location, msg){
        if(!this.logs[location]){
            this.logs[location] = [];
        }
        this.logs[location].push(msg);
    }
    clearLog(){
        this.logs = [];
    }
    get log(){
        return this.logs;
    }
    evalUserLocation(location, user){
        // does loction have their drink
        if(!location.drinks.some(d=> user.drinks.includes(d))){
            this.logMsg(location.name, `there is nothing for ${user.name} to drink`);
            return false;
        }
        // does location have food option beyond their hate
        const filteredFoodList = location.food.filter(food=>{
            return !user.wont_eat.includes(food);
        });
        if(!filteredFoodList.length){
            this.logMsg(location.name, `there is nothing for ${user.name} to eat`);
            return false;
        }
        return true;
    }
    eval(users){
        this.clearLog();
        const approvedLocations = [];
        this.locations.forEach(location => {
            let valid = true;
            users.forEach(user=>{
                const validLoc = this.evalUserLocation(location, user);
                if(!validLoc){valid = false}
            });
            if(valid){
                approvedLocations.push(location.name);
            }
        });
        return approvedLocations;
    }
    getDecision(users){
        const approved = this.eval(users);
        this.callback(approved, this.log);
    }
}