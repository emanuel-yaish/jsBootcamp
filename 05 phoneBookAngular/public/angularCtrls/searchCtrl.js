/**
 * Created by emanuel on 4/12/2016.
 */
(function() {
    "use strict";

    //search explorer ctrl//
    function SearchExplorerCtrl(PhoneBookService) {
        var searchExplorerVm = this;

        //init//
        searchExplorerVm.phoneBookService = PhoneBookService;
        searchExplorerVm.itemIdToDelete = "";
        searchExplorerVm.deleteState = false;
        searchExplorerVm.searchResults = searchExplorerVm.phoneBookService.searchResults;
    }

    //check if the item is a group//
    SearchExplorerCtrl.prototype.isGroup = function(item) {
        if(item.type == "Group") {
            return true;
        }
        //else//
        return false;
    };

    //check if the item is a contact//
    SearchExplorerCtrl.prototype.isContact = function(item) {
        if(item.type == "Contact") {
            return true;
        }
        //else//
        return false;
    };

    //group selected//
    SearchExplorerCtrl.prototype.groupSelected = function (id) {
        var searchExplorerVm = this;
              
        //change current group by id//
        searchExplorerVm.phoneBookService.setCurrentGroupById(id);
        searchExplorerVm.phoneBookService.currentView ="groupView";
    };

    //contact selected//
    SearchExplorerCtrl.prototype.contactSelected = function (item) {
        var searchExplorerVm = this;
        searchExplorerVm.phoneBookService.setSelectedContact(item.id);
        
        //change to show contact tab//
        searchExplorerVm.phoneBookService.currentView ="showContact";
    };

    //MODAL functions//
    //delete clicked//
    SearchExplorerCtrl.prototype.deleteSelected = function(itemIdToDelete){
        var searchExplorerVm = this;
        console.log(itemIdToDelete);
        searchExplorerVm.itemIdToDelete = itemIdToDelete;
        searchExplorerVm.deleteState = true;
    };

    //user select yes//
    SearchExplorerCtrl.prototype.approved = function() {
        var searchExplorerVm = this;

        //deleteItem//
        searchExplorerVm.phoneBookService.deleteItemById(searchExplorerVm.itemIdToDelete);
        searchExplorerVm.phoneBookService.searchByKeyword();
        searchExplorerVm.deleteState = false;
        searchExplorerVm.phoneBookService.updateServer();
    };

    //user select no or click on modal background//
    SearchExplorerCtrl.prototype.canceled = function () {
        var searchExplorerVm = this;
        searchExplorerVm.deleteState = false;
    };
    
    angular.module("phoneBookApp").controller("SearchExplorerCtrl", ["PhoneBookService", SearchExplorerCtrl]);
})();