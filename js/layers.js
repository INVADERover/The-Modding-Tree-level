addLayer("p", {
    name: "training", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Tr", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Tra", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 15)) mult = mult.times(upgradeEffect('p', 15))
        if (hasUpgrade('p', 24)) mult = mult.times(upgradeEffect('p', 24))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Training points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    
    upgrades: {
        11: {title: "-11-<br>forgotten item",
            description: "+1 base Exp gain",
            cost: new Decimal(9),
            unlocked(){return hasUpgrade("p",13)}},

        12: {title: "-12-<br>Starting training",
            description: "x1.5 Exp gain",
            cost: new Decimal(2),},

        13: {title: "-13-<br>Running",
            description: "x2 Exp gain",
            cost: new Decimal(2),
            unlocked(){return hasUpgrade("p",12)}},

        14: {title: "-14-<br>Run infinitely",
            description: "Unlock the way to running infinitely",
            cost: new Decimal(4),
            unlocked(){return hasUpgrade("p",13)}},
            
        15: {title: "-15-<br>Streamlining training",
            description: "x2 Tra gain",
            cost: new Decimal(24),
            effect() {return 2},
            unlocked(){return hasUpgrade("p",14)}},


        21: {title: "-21-<br>Visualization training 1",
            description: "Exp boost Exp gain, but it is very weak.",
            cost: new Decimal(1),
            effect() {return player.points.add(1).pow(0.04)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){return hasUpgrade("p",12)}},

        22: {title: "-22-<br>Visualization training 2",
            description: "Tra boost Exp gain, but it is very weak.",
            cost: new Decimal(4),
            effect() {return player[this.layer].points.add(1).pow(0.08)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){return hasUpgrade("p",21)}},

        23: {title: "-24-<br>Motivation 1",
            description: "Increase the amount of Exp gained based on AP",
            cost: new Decimal(100),
            effect() {return Decimal.pow(1.5, player.a.points)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){
                if ((player.l.points.gte(1)) && (hasUpgrade("p",22))){
                    return true}}},

        24: {title: "-24-<br>Motivation 2",
            description: "Increase the amount of Tre gained based on AP",
            cost: new Decimal(200),
            effect() {return player.a.points},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){
                if ((player.l.points.gte(1)) && (hasUpgrade("p",22))){
                    return true}}},
            
    },

    buyables: {
        11: {
            title: "Running*n", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return  Decimal.pow(10, x)
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                return Decimal.pow(2, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "x2 exp gain \n\n\
                Cost: " + format(data.cost) + " Tra\n\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Currently: x" + format(data.effect)
            },
            unlocked() { return hasUpgrade("p",14)},
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style: {'height':'170px'},
        },
    },

    clickables: {
        11: {
            display() {return "T+100"},
            canClick() {return true},
            onClick() {player[this.layer].points = player[this.layer].points.add(100)}
        }
    }
},
)

addLayer("l", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        level_cost: new Decimal(0),
    }},
    color: "yellow",
    resource: "Level", 
    row: "side",

    upgrades: {
        11: {title: "Lvl.1",
            description: "+1 base Exp gain",
            canAfford(){return player.points.gte(tmp[this.layer].upgrades[this.id].cost)},
            pay(){player.point = player.points.sub(this.cost())},
            }
        },

    layerShown() { return hasUpgrade("p",15)},
    milestonePopups: false,

    
    

},)

addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "The first step",
            done() {return player.p.points.gte(1)},
            tooltip: "Get a 1 tra",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        12: {
            name: "The truth first step",
            done() {return player.l.points.gte(1)},
            tooltip: "Reach Level 1",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
    },
},
)