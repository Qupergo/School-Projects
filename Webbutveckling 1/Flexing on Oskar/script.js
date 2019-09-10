class type {
    constructor(name, super_effective, not_effective, immune=[]) {
        this.name = name;
        this.super_effective = super_effective;
        this.not_effective = not_effective;
        this.immune = immune;
    }
}

let Normal;
let Fire;
let Water; 
let Electric;
let Grass;
let Ice;
let Fighting;
let Poison;
let Ground;
let Flying;
let Psychic; 
let Bug;
let Rock;
let Ghost;
let Dragon;
let Dark;
let Steel;
let Fairy;

Normal = new type("Normal", [], [Rock, Steel], [Ghost]);
Fire = new type("Fire", [Grass, Ice, Bug, Steel], [Fire, Water, Rock, Dragon]);
Water = new type("Water", [Fire, Ground, Rock], [Water, Grass, Dragon]);
Electric = new type("Electric", [Water, Flying], [Electric, Grass, Dragon], [Ground])
Grass = new type("Grass", [Water, Ground, Rock], [Fire, Grass, Poison, Flying, Bug, Dragon, Steel]);
Ice = new type("Ice", [Grass, Ground, Rock, Dragon], [Fire, Water, Ice, Steel]);
Fighting = new type("Fighting", [Normal, Rock, Steel, Ice, Dark], [Flying, Poison, Bug, Psychic, Fairy]);
Poison = new type("Poison", [Grass, Fairy], [Poison, Ground, Rock, Ghost], [Steel]);
Ground = new type("Ground", [Fire, Electric, Poison, Rock, Steel], [Grass, Bug], [Flying]);
Flying = new type("Flying", [Grass, Fighting, Bug], [Electric, Rock, Steel]);
Psychic = new type("Psychic", [Fighting, Poison], [Psychic, Steel], [Dark]);
Bug = new type("Bug", [Grass, Psychic, Dark], [Fire, Fighting, Poison, Flying, Ghost, Steel, Fairy]);
Rock = new type("Rock", [Fire, Ice, Flying, Bug], [Fighting, Ground, Steel]);
Ghost = new type("Ghost", [Psychic, Ghost], [Dark], [Normal]);
Dragon = new type("Dragon", [Dragon], [Steel], [Fairy]);
Dark = new type("Dark", [Psychic, Ghost], [Fighting, Dragon, Fairy]);
Steel = new type("Steel", [Ice, Rock, Fairy], [Fire, Water, Electric, Steel]);
Fairy = new type("Fairy", [Fighting, Dark, Dragon], [Fire, Poison, Steel]);

types = [Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy];


let table = document.createElement("table");
table.className = "chart";

for (let i = 0; i < types.length; i++) {
    let tr = document.createElement('tr');
    let current_attacker;

    for (let j = 0; j < types.length; j++) {

        let td = document.createElement('td');
        if (j === 0) {
            td.id = types[i].name;
            td.style.backgroundImage = `url("TypeImages/${types[i].name}.png")`
            current_attacker = types[i];
            console.log("Current attacker is " + current_attacker.name);
        }
        console.log("Current attacker is still " + current_attacker.name);

        if (i != 0) {
            if (current_attacker.super_effective.includes(types[i])) {
                td.classList.add("super_effective");
            }
            else if (current_attacker.not_effective.includes(types[i])) {
                td.classList.add("not_effective")
            }
        }
        else if (i === 0) {
            td.id = types[j].name;
            td.style.backgroundImage = `url("TypeImages/${types[j].name}.png")`
            
        }
        tr.appendChild(td);
    }
    table.appendChild(tr);
}
document.body.appendChild(table);
