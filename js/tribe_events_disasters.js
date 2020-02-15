/// <reference path="random.ts">
/// <reference path="tribe.ts">
/// <reference path="region.ts">
var FireSpreadsEvent = /** @class */ (function () {
    function FireSpreadsEvent() {
    }
    FireSpreadsEvent.triggers = function (tribe, region, progress) {
        if (!(tribe.hasTechnology("fire") && tribe.hasTechnology("construction")))
            return false;
        if (tribe.hasCulture("cautious"))
            return Random.chance(0.000001);
        else
            return Random.chance(0.00003);
    };
    FireSpreadsEvent.progress = function (tribe, region) {
        return 0;
    };
    FireSpreadsEvent.isChoice = function () {
        return true;
    };
    FireSpreadsEvent.choices = function (tribe) {
        return [
            "They are being punished.",
            "This is a learning experience."
        ];
    };
    FireSpreadsEvent.choicePrompt = function (tribe) {
        return "One day, while a member of " + tribe.title() + " is cooking with fire, the roof of their home\n    catches alight. Before long, multiple buildings are in flames. The tribespeople desperately try\n    to put out the fire, and succeed, but not before it has caused significant damage.";
    };
    FireSpreadsEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribe sees this as a punishment, but for what, they are not sure.",
            "The tribe has suffered heavy losses, but finds the strength to continue, and learn how to control the fire better."
        ];
    };
    FireSpreadsEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                // 20% chance for tribe to become superstitious,
                // 80% chance for tribe to become fearful.
                // Tribe gains the 'disasters are punishment' culture.
                if (Random.chance(0.2)) {
                    tribe.attitudes.monolith = Attitudes.Monolith.Superstitious;
                }
                else {
                    tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
                }
                tribe.addCulture("disastersArePunishment");
                // Tribe population reduced by 30-70%.
                var currentPopulation = tribe.population();
                var lowerLimit = Math.floor(currentPopulation * 0.3);
                var upperLimit = Math.floor(currentPopulation * 0.7);
                tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));
                console.log("New population: " + tribe.population());
            },
            function () {
                // 50% chance for tribe to become curious,
                // 50% chance for tribe to become fearful.
                if (Random.chance(0.5)) {
                    tribe.attitudes.monolith = Attitudes.Monolith.Curious;
                }
                else {
                    tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
                }
                // Tribe population reduced by 30-70%.
                var currentPopulation = tribe.population();
                var lowerLimit = Math.floor(currentPopulation * 0.3);
                var upperLimit = Math.floor(currentPopulation * 0.7);
                tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));
                tribe.addCulture("cautious");
                console.log("New population: " + tribe.population());
            }
        ];
    };
    FireSpreadsEvent.id = "FireSpreadsEvent";
    return FireSpreadsEvent;
}());
var DroughtEvent = /** @class */ (function () {
    function DroughtEvent() {
    }
    DroughtEvent.triggers = function (tribe, region, progress) {
        if (!tribe.hasTechnology("agriculture"))
            return false;
        // Chance dependent on water in region.
        // 0 chance if water > 2.
        switch (region.water()) {
            case 0: return Random.chance(0.0005);
            case 1: return Random.chance(0.0001);
            case 2: return Random.chance(0.00005);
            default: return false;
        }
    };
    DroughtEvent.progress = function (tribe, region) {
        return 0;
    };
    DroughtEvent.isChoice = function () {
        return true;
    };
    DroughtEvent.choices = function (tribe) {
        return [
            "They are being punished.",
            "They must leave this barren place.",
            "They must abandon their farms and hunt for food instead."
        ];
    };
    DroughtEvent.choicePrompt = function (tribe) {
        return "There have not been any rains in the region for some time, and the crops\n    of " + tribe.title() + " are suffering for it. It looks as though there will not be a harvest this year.";
    };
    DroughtEvent.outcomeMessages = function (tribe, region) {
        var outcomeMessages = [];
        if (tribe.hasCulture("disastersArePunishment")) {
            outcomeMessages.push("The tribe sees this as a sign of your displeasure.\n        They begin praying in the hope that it will alleviate the drought,\n        but it does not.");
        }
        else {
            outcomeMessages.push("The tribe sees this as some kind of punishment, but for what, they are not sure.");
        }
        outcomeMessages.push("The tribe moves on from the region, leaving their farms behind.");
        outcomeMessages.push("The tribe abandons agriculture, and transitions back to a hunter-gatherer society.");
        return outcomeMessages;
    };
    DroughtEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                // 20% chance for tribe to become superstitious,
                // 80% chance for tribe to become fearful.
                // Tribe gains the 'disasters are punishment' culture.
                if (Random.chance(0.2)) {
                    tribe.attitudes.monolith = Attitudes.Monolith.Superstitious;
                }
                else {
                    tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
                }
                tribe.addCulture("disastersArePunishment");
                // Tribe population reduced by 60-90%.
                var currentPopulation = tribe.population();
                var lowerLimit = Math.floor(currentPopulation * 0.6);
                var upperLimit = Math.floor(currentPopulation * 0.9);
                tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));
                console.log("New population: " + tribe.population());
            },
            function () {
                // Tribe migrates to another region.
                var otherRegions = region.nearby();
                var migrateRegion = Random.choice(otherRegions);
                region.removeTribe(tribe);
                migrateRegion.addTribe(tribe);
                // Tribe population reduced by 60-90%.
                var currentPopulation = tribe.population();
                var lowerLimit = Math.floor(currentPopulation * 0.6);
                var upperLimit = Math.floor(currentPopulation * 0.9);
                tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));
                console.log("New population: " + tribe.population());
            },
            function () {
                // Tribe abandons agriculture.
                tribe.addCulture("abandonedAgriculture");
                tribe.removeTechnology("agriculture");
                // Tribe population reduced by 60-90%.
                var currentPopulation = tribe.population();
                var lowerLimit = Math.floor(currentPopulation * 0.6);
                var upperLimit = Math.floor(currentPopulation * 0.9);
                tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));
                console.log("New population: " + tribe.population());
            }
        ];
    };
    DroughtEvent.id = "DroughtEvent";
    return DroughtEvent;
}());
var PlagueEvent = /** @class */ (function () {
    function PlagueEvent() {
    }
    PlagueEvent.triggers = function (tribe, region, progress) {
        if (tribe.hasTechnology("vaccines"))
            return false;
        if (tribe.population() < 1000)
            return false;
        if (tribe.hasTechnology("medicine"))
            return Random.chance(0.001);
        else
            return Random.chance(0.005);
    };
    PlagueEvent.progress = function (tribe, region) {
        return 0;
    };
    PlagueEvent.isChoice = function () {
        return false;
    };
    PlagueEvent.choices = function (tribe) {
        return [];
    };
    PlagueEvent.choicePrompt = function (tribe) {
        return "";
    };
    PlagueEvent.outcomeMessages = function (tribe, region) {
        var message = "With the population of " + tribe.title() + " growing rapidly, disease is commonplace in their settlement.\n        Before long, a plague spreads among the tribespeople, killing a significant number of them.";
        if (tribe.hasCulture("disastersArePunishment")) {
            message += " Many in the tribe see this as a punishment for their sins, and pray to you for forgiveness.";
        }
        else if (tribe.attitudes.monolith == Attitudes.Monolith.Curious) {
            message += " Some of the tribespeople are committed to finding a way to avoid plagues like this in the future.";
        }
        return [message];
    };
    PlagueEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                // Tribe population reduced by 70-95%.
                var currentPopulation = tribe.population();
                var lowerLimit = Math.floor(currentPopulation * 0.7);
                var upperLimit = Math.floor(currentPopulation * 0.95);
                tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));
                console.log("New population: " + tribe.population());
                if (tribe.attitudes.monolith == Attitudes.Monolith.Curious) {
                    tribe.addCulture("earlyScientists");
                }
            }
        ];
    };
    PlagueEvent.id = "PlagueEvent";
    return PlagueEvent;
}());
