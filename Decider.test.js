import {Decider} from './Decider';

const mockLocations = [
    {
        "name": "test",
        "food": ["foodOne"],
        "drinks": ["drinkOne", "DrinkTwo"]
    }
];

describe('decider', ()=>{
    const decider = new Decider(mockLocations);

    test('set correct locations', () => {
        expect(decider.locations.length).toBe(1);
        expect(decider.locations[0].name).toEqual('test');
    });

});

describe('evaluator', ()=>{
    test('validates user cant visit location without drink', ()=>{
        const decider = new Decider([]);
        const testLocation = {
            "name": "test",
            "food": ["foodOne"],
            "drinks": ["drinkOne", "DrinkTwo"]
        }
        const testUser = {
            "name": "billy",
            "wont_eat": ["foodOne"],
            "drinks": ["nada"]
        }
        const checkDrink = decider.evalUserLocation(testLocation, testUser);
        expect(checkDrink).toBe(false);
        expect(decider.log).toEqual({ test: [ 'there is nothing for billy to drink' ] });
    });

    test('validates user cant visit location without food option', ()=>{
        const decider = new Decider([]);
        const testLocation = {
            "name": "test",
            "food": ["horribleFood"],
            "drinks": ["drinkOne"]
        }
        const testUser = {
            "name": "sammy",
            "wont_eat": ["horribleFood"],
            "drinks": ["drinkOne"]
        }
        const checkMeal = decider.evalUserLocation(testLocation, testUser);
        expect(checkMeal).toBe(false);
        expect(decider.log).toEqual({ test: [ 'there is nothing for sammy to eat' ] });
    });

    test('validates user can visit location with food and drink', ()=>{
        const decider = new Decider([]);
        const testLocation = {
            "name": "test",
            "food": ["niceFood"],
            "drinks": ["drinkOne"]
        }
        const testUser = {
            "name": "gerry",
            "wont_eat": [""],
            "drinks": ["drinkOne"]
        }
        const checkMeal = decider.evalUserLocation(testLocation, testUser);
        expect(checkMeal).toBe(true);
        expect(decider.log).toEqual({});
    });

    test('triggers callback with results', ()=>{
        const mockCallback = jest.fn((correct, fail)=>{{correct, fail}});
        const decider = new Decider([], mockCallback);
        decider.getDecision([]);
        expect(mockCallback.mock.calls.length).toBe(1);
    })

    test('evaluates correct locations', ()=>{
        const testLocations = [
            {
                "name": "test1",
                "food": ["niceFood"],
                "drinks": ["drinkOne", "drinkTwo"]
            },
            {
                "name": "test2",
                "food": ["badFood"],
                "drinks": ["drinkTwo"]
            }
        ]
        const testUsers = [
            {
                "name": "bob",
                "wont_eat": ["badFood"],
                "drinks": ["drinkTwo"]
            },
            {
                "name": "ben",
                "wont_eat": [""],
                "drinks": ["drinkOne"]
            }
        ];
        let correctResults;
        let invalidResults;
        const resultCallback = ((correct, fail)=>{
            correctResults = correct;
            invalidResults = fail;
        });
        const decider = new Decider(testLocations, resultCallback);
        decider.getDecision(testUsers);

        expect(correctResults.length).toBe(1);
        expect(invalidResults.test2).toBeDefined();
        expect(correctResults).toEqual(['test1']);
    })
});

describe('logs', ()=>{
    test('adds to log', ()=>{
        const decider = new Decider([]);
        decider.logMsg('testPlace', 'test message');
        expect(Object.keys(decider.log).length).toBe(1);
        expect(decider.log.testPlace).toEqual(['test message']);
    })

    test('clears log', ()=>{
        const decider = new Decider([]);
        decider.logMsg('testPlace', 'test message');
        decider.clearLog();
        expect(Object.keys(decider.log).length).toBe(0);
    })
})