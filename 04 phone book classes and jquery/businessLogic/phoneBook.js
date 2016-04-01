/**
 * Created by emanuel on 3/15/2016.
 */
var PBApp = PBApp || {};

//phoneBook class//
PBApp.PhoneBook = (function() {
    "use strict";
    var Group = PBApp.Group;
    var Contact = PBApp.Contact;

    //CONSTANTS//
    var PHONEBOOK ="phone book";
    var ROOTID = -1;

    //phone book class//
    function PhoneBook() {
        //init phoneBook//
        this.root = new Group(ROOTID, PHONEBOOK, null);
        this.currentGroup = this.root;
    }

    //static id//
    PhoneBook.id = 0;

    //static function that generate id and forward item id by 1//
    PhoneBook.getNextId = function () {
        return this.id++;
    };

    //add new group to current group//
    PhoneBook.prototype.addNewGroup = function (newGroupName) {
        var newGroup = new Group(PhoneBook.getNextId(), newGroupName, this.currentGroup);
        this.currentGroup.addItem(newGroup);
    };

    //add new contact to current group//
    PhoneBook.prototype.addNewContact = function (firstName, lastName, phoneNumbers) {
        var newContact = new Contact(PhoneBook.getNextId(), firstName, lastName, phoneNumbers, this.currentGroup);
        this.currentGroup.addItem(newContact);
    };

    //return item by getting an id//
    PhoneBook.prototype.getItemByIdFromCurrentGroup = function(itemIdToFindInCurrentGroup) {
        var item = "";
        item = this.getItem(this.root, itemIdToFindInCurrentGroup);
        return item;
    };

    //recursion find item in the phone book//
    PhoneBook.prototype.getItem = function (group, id) {
        for(var i = 0 ; i < group.items.length; i++) {
            //if item is a contact//
            if(group.items[i] instanceof Contact) {
                if(group.items[i].id == id) {
                    return group.items[i];
                }
            }
            // item is a group //
            else {
                if(group.items[i].id == id) {
                    return group.items[i];
                }
                //drill down in phoneBook//
                var res = this.getItem(group.items[i], id);
                if(res) {
                    return res;
                }
            }
        }
    };

    //implement search by id//
    PhoneBook.prototype.searchById = function(group, id, res) {
        for(var i = 0 ; i < group.items.length; i++) {
            //if item is contact//
            if(group.items[i] instanceof Contact) {
                if(group.items[i].id== id) {
                    res.push(group.items[i]);
                    return;
                }
            }
            // item is a group //
            else {
                if(group.items[i].id == id) {
                    res.push(group.items[i]);
                    return;
                }
                //drill down in phoneBook//
                this.searchById(group.items[i], id, res);
            }
        }
    };

    //return item contact or group by given id//
    PhoneBook.prototype.getItemById = function(id) {
        if(id == ROOTID){
            return this.root;
        }
        var res = [];
        var item = "";
        //call the recursion//
        this.searchById(this.root, id, res);
        //if find item//
        if(res.length > 0) {
            item = res[0];
            return item;
        }
        //empty not found//
        return item;
    };

    //implement search by name//
    PhoneBook.prototype.search = function(group, name, res) {
        for(var i = 0 ; i < group.items.length; i++) {
            //if item is contact match first name or last name//
            if(group.items[i] instanceof Contact) {
                if(group.items[i].firstName.toLowerCase() == name.toLowerCase() || group.items[i].lastName.toLowerCase() == name.toLowerCase()) {
                    res.push(group.items[i]);
                }
            }
            // item is a group match group name//
            else {
                if(group.items[i].name.toLowerCase() == name.toLocaleLowerCase()) {
                    res.push(group.items[i]);
                }
                this.search(group.items[i], name, res);
            }
        }
    };

    //return list of items that match the keyword, group by name and contact by first or last name//
    PhoneBook.prototype.findItem = function (keyword) {
        var res = [];
        this.search(this.root, keyword, res);
        return res;
    };

    //delete group/item by id//
    PhoneBook.prototype.deleteItem = function (idToDelete) {
        var itemToDelete = this.getItemById(idToDelete);
        var itemParent = itemToDelete.parent;
        //if empty//
        if(itemParent) {
            itemParent.deleteItem(idToDelete);
        }
    };

    return new PhoneBook();
})();


