var IDAllocator = /** @class */ (function () {
    function IDAllocator() {
    }
    IDAllocator.allocate = function (base) {
        if (!IDAllocator.ids.hasOwnProperty(base)) {
            IDAllocator.ids[base] = 0;
        }
        var id = base + "-" + IDAllocator.ids[base];
        IDAllocator.ids[base]++;
        return id;
    };
    IDAllocator.ids = {};
    return IDAllocator;
}());
