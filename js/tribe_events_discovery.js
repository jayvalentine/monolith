/// <reference path="random.ts">
/// <reference path="tribe.ts">
/// <reference path="region.ts">
/// <reference path="language.ts">
var DiscoverFireEvent = /** @class */ (function () {
    function DiscoverFireEvent() {
    }
    DiscoverFireEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (tribe.hasTechnology("fire"))
            return false;
        if (tribe.hasCulture("afraidOfFire"))
            return false;
        var c = 0.000001;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Curious)
            c = 0.000002;
        return Random.progressiveChance(c, progress, 0.005);
    };
    DiscoverFireEvent.progress = function (tribe, region) {
        if (tribe.hasTechnology("fire"))
            return 0;
        if (tribe.hasCulture("afraidOfFire"))
            return 0;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (region.type() == Region.Type.Desert)
            return Random.interval(0, 3);
        else
            return Random.interval(-1, 2);
    };
    DiscoverFireEvent.isChoice = function () {
        return true;
    };
    DiscoverFireEvent.choices = function (tribe) {
        return [
            "Fire is useful.",
            "Fire is dangerous."
        ];
    };
    DiscoverFireEvent.choicePrompt = function (tribe) {
        return "While wandering on a hot, dry day, a member of " + tribe.title() + " notices food left in the wake of a wildfire.\n      Noticing that the food seems firmer and smells different, the tribesperson brings it back to show the others.";
    };
    DiscoverFireEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribe is curious about the possible uses of this phenomenon. Some begin using it to cook their food,\n        while others use it to provide light at night.",
            "The tribe is afraid of this phenomenon. They avoid it, not understanding the benefits it could bring."
        ];
    };
    DiscoverFireEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addTechnology("fire");
                if (Random.chance(0.1))
                    tribe.attitudes.monolith = Attitudes.Monolith.Curious;
                console.log(tribe.title() + " has discovered fire.");
            },
            function () {
                tribe.addCulture("afraidOfFire");
                if (Random.chance(0.1))
                    tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
                console.log(tribe.title() + " has shunned fire.");
            }
        ];
    };
    DiscoverFireEvent.id = "DiscoverFireEvent";
    return DiscoverFireEvent;
}());
var DiscoverToolsEvent = /** @class */ (function () {
    function DiscoverToolsEvent() {
    }
    DiscoverToolsEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (tribe.hasTechnology("tools"))
            return false;
        var c = 0.000001;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Curious)
            c = 0.000002;
        return Random.progressiveChance(c, progress, 0.005);
    };
    DiscoverToolsEvent.progress = function (tribe, region) {
        if (tribe.hasTechnology("tools"))
            return 0;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (region.resources() > 2)
            return Random.interval(0, 3);
        else
            return Random.interval(-1, 2);
    };
    DiscoverToolsEvent.isChoice = function () {
        return false;
    };
    DiscoverToolsEvent.choices = function (tribe) {
        return [];
    };
    DiscoverToolsEvent.choicePrompt = function (tribe) {
        return "";
    };
    DiscoverToolsEvent.outcomeMessages = function (tribe, region) {
        return [
            "A small group from " + tribe.title() + " have developed simple stone tools to aid them in their daily lives.\n        They show the rest of their tribe, and the tools quickly catch on, with the tribe using them to enhance\n        their abilities."
        ];
    };
    DiscoverToolsEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addTechnology("tools");
                console.log(tribe.title() + " has discovered tools.");
            }
        ];
    };
    DiscoverToolsEvent.id = "DiscoverToolsEvent";
    return DiscoverToolsEvent;
}());
var DiscoverConstructionEvent = /** @class */ (function () {
    function DiscoverConstructionEvent() {
    }
    DiscoverConstructionEvent.triggers = function (tribe, region, progress) {
        // Can't trigger if:
        // Tribe is unencountered
        // Tribe doesn't have tools
        // Tribe already has construction.
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (!tribe.hasTechnology("tools"))
            return false;
        if (tribe.hasTechnology("construction"))
            return false;
        var c = 0.000001;
        if (tribe.attitudes.others == Attitudes.Others.Defensive)
            c = 0.000002;
        return Random.progressiveChance(c, progress, 0.005);
    };
    DiscoverConstructionEvent.progress = function (tribe, region) {
        // Can't progress if:
        // Tribe is unencountered
        // Tribe doesn't have tools
        // Tribe already has construction.
        if (!tribe.hasTechnology("tools"))
            return 0;
        if (tribe.hasTechnology("construction"))
            return 0;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (region.resources() > 0)
            return Random.interval(0, 1);
        else
            return 0;
    };
    DiscoverConstructionEvent.isChoice = function () {
        return false;
    };
    DiscoverConstructionEvent.choices = function (tribe) {
        return [];
    };
    DiscoverConstructionEvent.choicePrompt = function (tribe) {
        return "";
    };
    DiscoverConstructionEvent.outcomeMessages = function (tribe, region) {
        return [
            tribe.titleCapitalized() + " has begun using stone and wood, along with their tools, to construct\n        simple buildings in which to live and store food."
        ];
    };
    DiscoverConstructionEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addTechnology("construction");
                tribe.setMigrationChance(0);
                console.log(tribe.title() + " has discovered construction.");
            }
        ];
    };
    DiscoverConstructionEvent.id = "DiscoverConstructionEvent";
    return DiscoverConstructionEvent;
}());
var DiscoverLanguageEvent = /** @class */ (function () {
    function DiscoverLanguageEvent() {
    }
    DiscoverLanguageEvent.triggers = function (tribe, region, progress) {
        // Can't trigger if:
        // Tribe is unencountered
        // Tribe population is < 80
        // Tribe already has language
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (tribe.hasTechnology("language"))
            return false;
        if (tribe.population() < 80)
            return false;
        var c = 0.000001;
        if (tribe.attitudes.others == Attitudes.Others.Diplomatic)
            c = 0.000002;
        return Random.progressiveChance(c, progress, 0.01);
    };
    DiscoverLanguageEvent.progress = function (tribe, region) {
        // Can't progress if:
        // Tribe is unencountered
        // Tribe population is < 80
        if (tribe.hasTechnology("language"))
            return 0;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (tribe.population() < 80)
            return 0;
        return Random.interval(0, 3);
    };
    DiscoverLanguageEvent.isChoice = function () {
        return false;
    };
    DiscoverLanguageEvent.choices = function (tribe) {
        return [];
    };
    DiscoverLanguageEvent.choicePrompt = function (tribe) {
        return "";
    };
    DiscoverLanguageEvent.outcomeMessages = function (tribe, region) {
        DiscoverLanguageEvent.tribeName = DiscoverLanguageEvent.generateTribeName(tribe, region);
        return [
            "You notice that a tribe seems to be using a more advanced form of communication.\n        As your language coprocessor engages, you discover that they now call themselves the\n        " + Language.toTitle(tribe.language().translate(DiscoverLanguageEvent.tribeName)) + "."
        ];
    };
    DiscoverLanguageEvent.outcomeFunctions = function (tribe, region) {
        var tribeName = DiscoverLanguageEvent.tribeName;
        return [
            function () {
                tribe.addTechnology("language");
                tribe.setName(tribeName);
                console.log("A tribe has discovered language.");
            }
        ];
    };
    DiscoverLanguageEvent.generateTribeName = function (tribe, region) {
        // Determine what to call the tribe.
        var tribeDescription = [];
        var adjective = "";
        if (tribe.attitudes.monolith == Attitudes.Monolith.Superstitious) {
            adjective = "devout";
        }
        else if (tribe.attitudes.monolith == Attitudes.Monolith.Curious) {
            adjective = "curious";
        }
        else if (tribe.attitudes.monolith == Attitudes.Monolith.Fearful) {
            adjective = "fearful";
        }
        if (tribe.attitudes.others == Attitudes.Others.Aggressive) {
            tribeDescription.push(new Noun("warrior", true, false, [adjective]));
        }
        else if (tribe.attitudes.world == Attitudes.World.Explore) {
            tribeDescription.push(new Noun("explorer", true, false, [adjective]));
        }
        else if (tribe.attitudes.self == Attitudes.Self.Egalitarian) {
            tribeDescription.push(new Noun("community", false, false, [adjective]));
        }
        else {
            tribeDescription.push(new Noun("person", true, false, [adjective]));
        }
        return tribeDescription;
    };
    DiscoverLanguageEvent.id = "DiscoverLanguageEvent";
    return DiscoverLanguageEvent;
}());
var DiscoverAgricultureEvent = /** @class */ (function () {
    function DiscoverAgricultureEvent() {
    }
    DiscoverAgricultureEvent.triggers = function (tribe, region, progress) {
        // Can't trigger if:
        // Tribe is unencountered
        // Tribe population is < 200
        // Tribe doesn't have tools
        // Tribe already has agriculture
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (tribe.hasTechnology("agriculture"))
            return false;
        if (tribe.population() < 200)
            return false;
        if (!tribe.hasTechnology("tools"))
            return false;
        // If the tribe has already abandoned agriculture in the past, this event cannot trigger.
        if (tribe.hasCulture("abandonedAgriculture"))
            return false;
        var c = 0.000001;
        // Increase chance in regions with high food.
        if (region.food() > 4)
            c = 0.000005;
        else if (region.food() > 2)
            c = 0.000002;
        return Random.progressiveChance(c, progress, 0.01);
    };
    DiscoverAgricultureEvent.progress = function (tribe, region) {
        // Can't progress if:
        // Tribe is unencountered
        // Tribe population is < 200
        // Tribe doesn't have tools.
        if (tribe.hasTechnology("agriculture"))
            return 0;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (tribe.population() < 200)
            return 0;
        if (!tribe.hasTechnology("tools"))
            return 0;
        if (tribe.hasCulture("abandonedAgriculture"))
            return 0;
        if (region.food() > 4)
            return Random.interval(1, 5);
        else if (region.food() > 2)
            return Random.interval(-1, 4);
        else
            return Random.interval(-2, 3);
    };
    DiscoverAgricultureEvent.isChoice = function () {
        return false;
    };
    DiscoverAgricultureEvent.choices = function (tribe) {
        return [];
    };
    DiscoverAgricultureEvent.choicePrompt = function (tribe) {
        return "";
    };
    DiscoverAgricultureEvent.outcomeMessages = function (tribe, region) {
        return [
            "A handful of members of " + tribe.title() + " seem to have stopped hunting or gathering,\n        and instead have begun collecting wild seeds and planting them. After the first harvest,\n        this new method of producing food is adopted by the whole tribe."
        ];
    };
    DiscoverAgricultureEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addTechnology("agriculture");
                console.log("A tribe has discovered agriculture.");
            }
        ];
    };
    DiscoverAgricultureEvent.id = "DiscoverAgricultureEvent";
    return DiscoverAgricultureEvent;
}());
