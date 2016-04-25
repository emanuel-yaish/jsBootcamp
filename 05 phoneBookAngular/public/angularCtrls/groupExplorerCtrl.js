/**
 * Created by emanuel on 4/5/2016.
 */
(function() {
    "use strict";

    //group explorer ctrl//
    function GroupExplorerCtrl(PhoneBookService) {
        var groupExplorerVm = this;
  
        //init//
        groupExplorerVm.phoneBookService = PhoneBookService;
        groupExplorerVm.selectedContact = {};
        groupExplorerVm.itemIdToDelete ="";
        groupExplorerVm.deleteState = false;
    }

    //check if the item is a group//
    GroupExplorerCtrl.prototype.isGroup = function(item) {
             if(item.type == "Group") {
             return true;
             }
            //else//
            return false;
        };

    //check if the item is a contact//
    GroupExplorerCtrl.prototype.isContact = function(item) {
             if(item.type == "Contact") {
             return true;
             }
             //else//
            return false;
        };

    //group selected//
    GroupExplorerCtrl.prototype.groupSelected = function (id) {
        var groupExplorerVm = this;
       
        //change current group by id//
        groupExplorerVm.phoneBookService.setCurrentGroupById(id);
    };

    //contact selected//
    GroupExplorerCtrl.prototype.contactSelected = function (item) {
        var groupExplorerVm = this;

        //switch to selected contact//
        groupExplorerVm.phoneBookService.setSelectedContact(item.id);
        groupExplorerVm.phoneBookService.currentView ="showContact";
    };
    
    //MODAL functions//
    //delete selected open the modal//
    GroupExplorerCtrl.prototype.deleteSelected = function(itemIdToDelete){
        var groupExplorerVm = this;
        groupExplorerVm.itemIdToDelete = itemIdToDelete;
        groupExplorerVm.deleteState = true;
    };

    //user approved the delete//
    GroupExplorerCtrl.prototype.approved = function() {
        var groupExplorerVm = this;
        
        //deleteItem//
        groupExplorerVm.phoneBookService.deleteItemById(groupExplorerVm.itemIdToDelete);
        groupExplorerVm.deleteState = false;
        groupExplorerVm.phoneBookService.updateServer();
    };

    //user cancel the delete//
    GroupExplorerCtrl.prototype.canceled = function () {
        var groupExplorerVm = this;
        groupExplorerVm.deleteState = false;
        return;
    };
    
    angular.module("phoneBookApp").controller("GroupExplorerCtrl",["PhoneBookService", GroupExplorerCtrl] );
})();