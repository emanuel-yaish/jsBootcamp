/**
 * Created by emanuel on 3/15/2016.
 */
var PBApp = PBApp || {};

PBApp.Group = (function() {
    "use strict";
    //group class//
    function Group(id, name, parent) {
        //parent constructor//
        PBApp.BookItem.call(this, id, parent);
        //init Group class//
        this.name = name;
        this.items = [];
        this.type = "Group";
    }

    //inheritance from bookItem//
    Group.prototype = Object.create(PBApp.BookItem.prototype);

    //add group or contact to group items//
    Group.prototype.addItem = function (item) {
        this.items.push(item);
    };

    //delete group or contact from group items//
    Group.prototype.deleteItem = function (itemToDeleteId) {
        var index = this.getItemIndexById(itemToDeleteId);
        this.items.splice(index, 1);
    };

    //get the position of item in items array//
    Group.prototype.getItemIndexById = function (itemId) {
        for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
            if (this.items[itemIndex].id == itemId) {
                return itemIndex;
            }
        }
    };

    return Group;
})();
