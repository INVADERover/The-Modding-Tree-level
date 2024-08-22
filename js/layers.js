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
    resource: "Training", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
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
        11: {
            title: "Starting training",
            description: "+1 base Exp gain",
            cost: new Decimal(1),},

        12: {
            title: "Running",
            description: "x2 Exp gain",
            cost: new Decimal(1),
            unlocked(){return hasUpgrade("p",11)}},

        21: {
            title: "Visualization training",
            description: "Exp boost Exp gain, but it is very weak.",
            cost: new Decimal(2),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked(){return hasUpgrade("p",12)}},

        13: {
            title: "Please keep running!",
            description: "x2 Exp gain",
            cost: new Decimal(3),
            unlocked(){return hasUpgrade("p",12)}},
    },
})


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
            name: "EIEIO",
            done() {return player.p.points.gte(2)},
            goalTooltip: "How did this happen?", // Shows when achievement is not completed
            doneTooltip: "You did it!", // Showed when the achievement is completed
        },
    },
},
)