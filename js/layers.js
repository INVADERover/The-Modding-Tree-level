addLayer("t", {
    name: "Training",
    symbol: "T",
    position: 0,
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#33FF57",
    requires: new Decimal(10),
    resource: "Training",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    
    gainMult() {
        let mult = new Decimal(1);
        if (hasUpgrade('t', 24)) mult = mult.times(upgradeEffect('t', 24));
        if (hasUpgrade('t', 25)) mult = mult.times(upgradeEffect('t', 25));

        if (hasUpgrade('l', 22)) mult = mult.times(upgradeEffect('l', 22));
        if (hasUpgrade('l', 25)) mult = mult.times(upgradeEffect('l', 25));
        
        if (hasUpgrade('m', 22)) mult = mult.times(layers.m.effect());

        mult = mult.times(layers.c.effect());
        return mult;
    },

    gainExp() {
        return new Decimal(1);
    },
    
    row: 0,
    layerShown() { return true },

    upgrades: {
        21: { 
            title: "-T11-",
            description: "x2 EXP gain",
            cost() {return new Decimal(2).times(player.c.c1up)},
            effect() {
                let eff = new Decimal(2);
                if (hasUpgrade('l', 24)) eff = eff.add(upgradeEffect('l', 24));
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() {
                if(player.a.points.gte(1)) { return true }//デフォ
                if(inChallenge("c", 12)) { return true }//C12
             },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        22: { 
            title: "-T12-",
            description: "EXP boost to EXP gain",
            cost() {return new Decimal(2).times(player.c.c1up)},
            effect() { return player.points.add(1).pow(0.06) },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() {
                if(hasUpgrade("t", 21)) { return true }//デフォ
                if(inChallenge("c", 12)) { return true }//C12
             },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        23: { 
            title: "-T13-",
            description: "TRA boost to EXP gain",
            cost() {return new Decimal(2).times(player.c.c1up)},
            effect() { return player[this.layer].points.add(2).pow(0.1) },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() {
                if(hasUpgrade("t", 22)) { return true }//デフォ
                if(inChallenge("c", 12)) { return true }//C12
             },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        24: { 
            title: "-T14-",
            description: "TRA boost to TRA gain",
            cost() {return new Decimal(18).times(player.c.c1up)},
            effect() { return player[this.layer].points.add(2).pow(0.04) },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() {
                if(player.l.points.gte(1) && hasUpgrade("t", 23)) { return true }//デフォ
                if(inChallenge("c", 12)) { return true }//C12
             },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        25: { 
            title: "-T15-",
            description: "x4 TRA gain",
            cost() {return new Decimal(90).times(player.c.c1up)},
            effect() { return 4 },
            unlocked() {
                if(hasUpgrade("t", 24)) { return true }//デフォ
                if(inChallenge("c", 12)) { return true }//C12
             },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        26: { 
            title: "-T16-",
            description: "x6 EXP gain",
            cost() {return new Decimal(1111).times(player.c.c1up)},
            effect() { return 6 },
            unlocked() {
                if(hasMilestone("m", 1) && hasUpgrade("t", 25)) { return true }//デフォ
                if(inChallenge("c", 12)) { return true }//C12
             },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        27: { 
            title: "-T17-",
            description: "Unlock new Training buyable",
            cost() { return new Decimal(hasUpgrade("p", 23) ? 1 : "1e100") },
            unlocked() {
                if(hasMilestone("m", 1) && hasUpgrade("t", 26)) { return true }//デフォ
                if(inChallenge("c", 12)) { return true }//C12
             },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
    },

    buyables: {
        11: {
            title: "-TB1-",
            cost(x) {
                let cost = Decimal.pow(11, x).times(player.c.c1up);

                if (hasUpgrade('p', 21)) {
                    cost = cost.div(upgradeEffect('p', 21));
                }
                return cost.ceil();
            },
            effect(x) { return Decimal.pow(2, x); },
            display() {
                return `x2 EXP gain<br>
                        Amount: ${player.t.buyables[11]}<br>
                        Effect: x${format(tmp.t.buyables[11].effect)}<br>
                        Cost: ${format(tmp.t.buyables[11].cost)} <span class="tracss">Tra</span>
                    `;
            },
            canAfford() { return player.t.points.gte(tmp.t.buyables[11].cost) },
            buy() {
                let cost = this.cost();

                if (hasMilestone('p', 0)) { cost = cost.div(2) }//リソース計算
                if (!hasMilestone('p', 4)) { player.t.points = player.t.points.sub(cost);}//リソースからコストを減算

                if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12デバフ計算
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            unlocked() { return hasUpgrade("l", 21) },
            style: { 'height': '150px', 'width': '150px', 'font-size': '12px' },
        },
        12: {
            title: "-TB2-",
            cost(x) {
                let cost = Decimal.pow(x.add(1), x.add(1)).times(player.c.c1up);

                if (hasUpgrade('p', 22)) {
                    cost = cost.div(upgradeEffect('p', 22));
                }
                return cost.ceil();
            },
            effect(x) {
                let eff = new Decimal(x)
                if (hasMilestone("c", 0)) eff = eff.times(2)
                return eff
            },
            display() {
                return `Gain <span class="tracss">Tra</span> per second
                        Amount: ${player.t.buyables[12]}<br>
                        Effect: +${format(tmp.t.buyables[12].effect)}%<br>
                        Cost: ${format(tmp.t.buyables[12].cost)} <span class="tracss">Tra</span>
                    `;
            },
            canAfford() { return player.t.points.gte(tmp.t.buyables[12].cost) },
            buy() {
                let cost = this.cost();

                if (hasMilestone('p', 3)) { cost = cost.div(2) }//リソース計算
                if (!hasMilestone('p', 5)) { player.t.points = player.t.points.sub(cost);}//リソースからコストを減算
                if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12デバフ計算
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            unlocked() { return hasMilestone('p', 1) },
            style: { 'height': '150px', 'width': '150px', 'font-size': '12px' },
        },
        13: {
            title: "-TB3-",
            cost(x) {
                let coss = new Decimal(x.gte(1) ? Decimal.pow(1000, x).times(player.c.c1up) : 1);
                return coss.ceil();
            },
            effect(x) {
                return new Decimal.add(x);
            },
            display() {
                return `Add <span class="tracss">T11</span> and <span class="tracss">T12</span> for free<br>
                        Amount: ${player.t.buyables[13]}<br>
                        Effect: x${format(tmp.t.buyables[13].effect)}<br>
                        Cost: ${format(tmp.t.buyables[13].cost)} <span class="tracss">Tra</span>
                    `;
            },
            canAfford() { return player.t.points.gte(tmp.t.buyables[13].cost) },
            buy() {
                let cost = this.cost();

                if (!hasMilestone('p', 5)) { player.t.points = player.t.points.sub(cost);}//リソースからコストを減算
                if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12デバフ計算
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            unlocked() { return hasUpgrade('t', 27) },
            style: { 'height': '150px', 'width': '150px', 'font-size': '12px' },
        },
    },
    
    automate() {
        if (tmp.t.buyables[11].canAfford && player.m.autoTB1) {//TB1自動購入
            addBuyables('t', 11, 1);
            if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12デバフ計算

            let ca = 0;

            if (hasMilestone('p', 0)) { ca = 1; }
            if (hasMilestone('p', 4)) { ca = 2; }
            switch (ca) {
                case 0:
                    player.t.points = player.t.points.sub(tmp.t.buyables[11].cost);
                    break;
                case 1:
                    player.t.points = player.t.points.sub(tmp.t.buyables[11].cost.div(2));
                    break;
                case 2:
                    //消費なし
                    break;
            }
        }
        if (tmp.t.buyables[12].canAfford && player.m.autoTB2) {//TB2自動購入
            addBuyables('t', 12, 1);
            if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12デバフ計算
            
            let ca = 0;
            if (hasMilestone('p', 3)) { ca = 1; }
            if (hasMilestone('p', 5)) { ca = 2; }
            switch (ca) {
                case 0:
                    player.t.points = player.t.points.sub(tmp.t.buyables[12].cost);
                    break;
                case 1:
                    player.t.points = player.t.points.sub(tmp.t.buyables[12].cost.div(2));
                    break;
                case 2:
                    //消費なし
                    break;
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() {
            if (hasUpgrade('l', 23)) {
                return 'Gain ' + format(upgradeEffect('l', 23)) + '% per second';
            }
        }],
        "blank",
        "buyables",
        "blank",
        "upgrades"
    ],

    passiveGeneration() {
        if (hasUpgrade('l', 23)) return upgradeEffect('l', 23).div(100);
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer);
            if (player.m.points.gte(1)) player.t.upgrades.push("21");
            if (player.m.points.gte(2)) player.t.upgrades.push("22");
            if (player.m.points.gte(3)) player.t.upgrades.push("23");
            if (player.m.points.gte(4)) player.t.upgrades.push("24");
            if (player.m.points.gte(5)) player.t.upgrades.push("25");
            if (player.m.points.gte(6)) player.t.upgrades.push("26");
            if (player.m.points.gte(7)) player.t.upgrades.push("27");
        }
    },
});

addLayer("m", {
    name: "Meditation",
    symbol: "M",
    position: 1,
    startData() { 
        return {
            unlocked: 0,
            points: new Decimal(0),
        }
    },
    effect() {
        return Decimal.pow(1.6, player.m.points)
    },
    effectDescription() { 
        if (!hasUpgrade('m', 22)){return "<br>x" + format(this.effect()) + " Exp gain"
        } else {
        return "<br>x" + format(this.effect()) + " Exp and Training gain"
        }
    },
    color: "#3357FF",
    requires: new Decimal(2000),
    resource: "Meditation",
    baseResource: "Training",
    baseAmount() { return player.t.points },
    type: "static",
    exponent: 2,
    base: 2,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        return mult
    },
    row: 1,
    layerShown() { return hasAchievement("a", 13) },
    
    upgrades: {
        21: {
            title: "-M11-",
            description: "x2 Physical gain",
            cost: new Decimal(4),
            effect() { return Decimal.add(2) },
        },
        22: {
            title: "-M12-",
            description: "Meditation boosts Training gain",
            cost: new Decimal(5),
            effect() { return Decimal.add(2) },
            unlocked() { return hasUpgrade("m", 21) && hasMilestone("c", 1) },
        },
    },

    milestones: {
        0: { 
            requirementDescription: "1 MED",
            effectDescription: "Keep TRA upgrades based on Med<br>Gain TRA per second by MED",
            done() { return player.m.points.gte(1) }
        },
        1: { 
            requirementDescription: "2 MED",
            effectDescription: "2 New TRA Upgrade",
            done() { return player.m.points.gte(2) }
        },
        2: { 
            requirementDescription: "3 MED",
            effectDescription: "Gain TRA per second by ACP",
            done() { return player.m.points.gte(3) }
        },
    },
})


addLayer("p", {
    name: "Physical",
    symbol: "P",
    position: 3,
    row: 1,
    resource: "Physical",
    baseResource: "TRA",
    baseAmount() { return player.t.points },
    requires: new Decimal(200000),
    color: "#FF5733",
    type: "normal",
    exponent: 0.4,
    layerShown() { return hasUpgrade('l', 25) },

    startData() { 
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    effect() { 
        return player.p.points.add(1).pow(0.2) 
    },
    effectDescription() { 
        return "<br>x" + format(this.effect()) + " EXP gain" 
    },
    gainMult() {
        let mult = new Decimal(1)
        if (hasMilestone("p", 2)) mult = mult.times(1.5)
        if (hasUpgrade("m", 21)) mult = mult.times(upgradeEffect('m', 21))
        if (hasMilestone("c", 1)) mult = mult.times(2)
        if (hasMilestone("c", 2)) mult = mult.times(3)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        return mult
    },

    upgrades: {//pアップグレード
        21: {
            title: "-P11-",
            description: "Divide TB1 cost by Med",
            cost: new Decimal(5),
            effect() { return player.m.points.add(1) },
            effectDisplay() { return "/" + format(this.effect()) },
        },
        22: {
            title: "-P12-",
            description: "Divide TB2 cost by Med",
            cost: new Decimal(30),
            effect() { return player.m.points.add(1) },
            effectDisplay() { return "/" + format(this.effect()) },
            unlocked() { return hasUpgrade("p", 21) },
        },
        23: {
            title: "-P13-",
            description: "Significantly reduces the cost of -T17-",
            cost: new Decimal(3000),
            unlocked() { return hasUpgrade("p", 22) && hasMilestone("c", 2)},
        },
    },

    milestones: {//pマイルストーン
        0: { 
            requirementDescription: "1 Phy -PM1-",
            effectDescription: function() {
                if (hasMilestone('p', 3)) {
                    return "Autobuy TB1 and 2<br>Buying TB1 and 2 uses half the resources."
                } else {
                    return "Autobuy TB1<br>Buying TB1 uses half the resources."
                }
            
            },

            done() { 
                return player.p.points.gte(1);
            },
            toggles: function() {
                let data = [["m", "autoTB1"]];
                if (hasMilestone('p', 3)) {
                    data.push(["m", "autoTB2"]);
                }
                return data;
            },
        },
        1: { 
            requirementDescription: "2 Phy -PM2-",
            effectDescription: "Unlock a new buyable to Training",
            done() { return player.p.points.gte(2) },
        },
        2: { 
            requirementDescription: "3 Phy -PM3-",
            effectDescription: "x1.5 PHY gain",
            done() { return player.p.points.gte(3) },
        },
        3: { 
            requirementDescription: "15 Phy -PM4-",
            effectDescription: "Add TB2 to the effect of Physical milestone 1",
            done() { return player.p.points.gte(15) },
            unlocked() { return hasMilestone('p', 2) },
        },
        4: { 
            requirementDescription: "100 Phy -PM5-",
            effectDescription: "TB1 costs no resources.",
            done() { return player.p.points.gte(100) },
            unlocked() { return hasMilestone('p', 3) },
        },
        5: { 
            requirementDescription: "  Phy -PM6-",
            effectDescription: "TB2 costs no resources.",
            done() { return player.p.points.gte(10000000) },
            unlocked() { return hasMilestone('p', 3) },
        },
    },
})


addLayer("c", {
    name: "Challenge",
    symbol: "C",
    position: 2,
    row: 1,
    color: "#FFD700",
    resource: "Challenge",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            c1up: new Decimal(1),
        }
    },
    effect() { 
        return Decimal.pow(2,player.c.points)
    },
    effectDescription() { 
        return "<br>x" + format(this.effect()) + " TRA gain" 
    },

    challenges: {//cチャレンジ
        11: {
            name: "-C1-",
            completionLimit: 3,

            challengeDescription() {
                return "complete: " + challengeCompletions('c', 11) + "/3<br><br>Training layer item cost x" + Decimal.pow(10, challengeCompletions('c', 11) * 2 + 2) + "<br>all Training layer reset.<br><br>"
            },

            goalDescription(){
                switch (challengeCompletions('c', 11)) {
                    case 0:
                        return "100,000,000 EXP<br>"
                    case 1:
                        return "2.00e9<br>"
                }
            },

            canComplete(){
                switch (challengeCompletions('c', 11)) {
                    case 0:
                        return player.points.gte(100000000)
                    case 1:
                        return player.points.gte("2e9")
                }
            },

            rewardDescription: "Get 1 Challenge point",

            onEnter() {
                player.points = new Decimal(0)
                player.t.points = new Decimal(0)
                player.t.upgrades = []
                player.t.buyables[11] = new Decimal(0)
                player.t.buyables[12] = new Decimal(0)
                player.c.c1up = Decimal.pow(10, challengeCompletions('c', 11) * 2 + 2)//upgrade倍率コンプリート回数
            },
            onExit() {
                player.c.c1up = new Decimal(1)
            },
            onComplete() {
                player.c.points = player.c.points.add(1)
            },
        },

        12: {
            name: "-C2-",
            completionLimit: 3,
            challengeDescription() {return "complete: " + challengeCompletions('c', 11) + "/3<br><br>Each Training layer item purchase multiplies its cost by 10.<br>all Training layer reset.<br>" },
            goalDescription: "10,000,000 EXP<br>",
            
            canComplete(){return player.points.gte(10000000) },

            rewardDescription: "Get 1 Challenge point",

            onEnter() {
                player.points = new Decimal(0)
                player.t.points = new Decimal(0)
                player.t.upgrades = []
                player.t.buyables[11] = new Decimal(0)
                player.t.buyables[12] = new Decimal(0)
            },
            onExit() {
                player.c.c1up = new Decimal(1)
            },
            onComplete() {
                player.c.points = player.c.points.add(1)
            },
        },
    },

    milestones: {//cマイルストーン
        0: { 
            requirementDescription: "1 Cha -CM1-",
            effectDescription: "Double TB2 effect",
            done() { 
                return player.c.points.gte(1);
            },
        },
        1: { 
            requirementDescription: "2 Cha -CM2-",
            effectDescription: "x2 PHY gain<br>Unlock new Meditation upgrade",
            done() { 
                return player.c.points.gte(2);
            },
            unlocked() { return hasMilestone("c", 0) },
        },
        2: { 
            requirementDescription: "3 Cha -CM2-",
            effectDescription: "x3 PHY gain<br>Unlock new Physical upgrade",
            done() { 
                return player.c.points.gte(3);
            },
            unlocked() { return hasMilestone("c", 1) },
        },
    },

    tabFormat: [//cタブレイアウト
        "main-display",
        "challenges",
        "blank",
        "milestones"
    ],

    layerShown() { return hasUpgrade('l', 31) },
})

addLayer("l", {
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
            level_cost: new Decimal(0),
        }
    },
    color: "green",
    resource: "LVL",
    row: "side",

    upgrades: {//Lアップグレード
        21: {
            title: "Lvl.1",
            description: "Unlock new Training buyable",
            currencyDisplayName: "Exp",
            currencyInternalName: "points",
            cost: new Decimal(50),
            onPurchase() { player.l.points = player.l.points.add(1) },
        },
        22: {
            title: "Lvl.2",
            description: "LVL boost to Tra gain",
            currencyDisplayName: "Exp",
            currencyInternalName: "points",
            cost: new Decimal(300),
            effect() { return Decimal.pow(1.2, player.l.points) },
            effectDisplay() { return format(this.effect()) + "x" },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 21) },
        },
        23: {
            title: "Lvl.3",
            description: "Gain TRA per second by LVL",
            currencyDisplayName: "Tra",
            currencyInternalName: "points",
            currencyLayer: "t",
            cost: new Decimal(50),
            effect() {
                let eff = Decimal.add(player.l.points, 2)
                if (hasMilestone("m", 0)) eff = eff.add(player.m.points)
                if (hasMilestone("m", 2)) eff = eff.add(player.a.points)
                eff = eff.add(buyableEffect("t", 12))

                return eff
            },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 22) },
        },
        24: {
            title: "Lvl.4",
            description: "-T11- is boosted by other Tra upgrades.",
            currencyDisplayName: "Exp",
            currencyInternalName: "points",
            cost: new Decimal(500000),
            effect() { return Decimal.add(player.t.upgrades.length).div(2) },
            effectDisplay() { return format(this.effect()) + "+" },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 23) },
        },
        25: {
            title: "Lvl.5",
            description: "Unlock new layer<br>&<br>x2 Tra gain",
            currencyDisplayName: "Med",
            currencyInternalName: "points",
            currencyLayer: "m",
            cost: new Decimal(3),
            effect() { return 2 },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 24) },
        },
        31: {
            title: "Lvl.6",
            description: "Unlock new layer",
            currencyDisplayName: "Phy",
            currencyInternalName: "points",
            currencyLayer: "p",
            cost: new Decimal(20),
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 25) },
        },
    },

    layerShown() { return hasAchievement("a", 12) },
    milestonePopups: false,
})

addLayer("a", {
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#FFD733",
    resource: "ACP",
    row: "side",
    tooltip() {
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Reach 1 Tra",
            done() { return player.t.points.gte(1) },
            tooltip: "Reward: Add ACP to the effect of base Exp",
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        12: {
            name: "Purchase -T13-",
            done() { return hasUpgrade("t", 23) },
            tooltip: "Reward: Unlock LevelUp",
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        13: {
            name: "Purchase -T15-",
            done() { return hasUpgrade("t", 25) },
            tooltip: "Reward: Unlock new layer",
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        14: {
            name: "Reach Lvl.5",
            done() { return hasUpgrade("l", 25) },
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        15: {
            name: "Reach 5 Phy",
            done() { return player.p.points.gte(5) },
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        16: {
            name: "Complete One Challenge",
            done() { return player.c.points.gte(1) },
            onComplete() { player.a.points = player.a.points.add(1) }
        },
    },
})
