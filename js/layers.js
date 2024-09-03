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
        if (hasUpgrade('p', 15)) mult = mult.times(2)
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
        11: {title: "forgotten item",
            description: "+1 base Exp gain",
            cost: new Decimal(9),
            unlocked(){return hasUpgrade("p",13)}},

        12: {title: "Starting training",
            description: "x1.5 Exp gain",
            cost: new Decimal(2),},

        13: {title: "Running",
            description: "x2 Exp gain",
            cost: new Decimal(2),
            unlocked(){return hasUpgrade("p",12)}},

        14: {title: "Run infinitely",
            description: "Unlock the way to run infinitely",
            cost: new Decimal(4),
            unlocked(){return hasUpgrade("p",13)}},
            
        15: {title: "Streamlining training",
            description: "x2 Training gain",
            cost: new Decimal(24),
            unlocked(){return hasUpgrade("p",14)}},


        21: {title: "Visualization training",
            description: "Exp boost Exp gain, but it is very weak.",
            cost: new Decimal(1),
            effect() {return player.points.add(1).pow(0.04)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked(){return hasUpgrade("p",12)}},

        22: {title: "Visualization training2",
            description: "Training boost Exp gain, but it is very weak.",
            cost: new Decimal(4),
            effect() {return player[this.layer].points.add(1).pow(0.08)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked(){return hasUpgrade("p",21)}},    
            
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
},
)

addLayer("l", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "Level", 
    row: "side",
    layerShown() { return hasUpgrade("p",15)},
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
},
)

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
            tooltip: "Get a farm point.\n\nReward: The dinosaur is now your friend (you can max Farm Points).", // Showed when the achievement is completed
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
    },
},
)