var Random = /** @class */ (function () {
    function Random() {
    }
    Random.interval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Random.choice = function (array) {
        var index = Random.interval(0, array.length - 1);
        return array[index];
    };
    Random.chance = function (c) {
        if (Math.random() < c)
            return true;
        else
            return false;
    };
    Random.progressiveChance = function (c, progress, upperBound) {
        var limit = Math.min(progress * c, upperBound);
        if (Math.random() < limit)
            return true;
        else
            return false;
    };
    return Random;
}());
