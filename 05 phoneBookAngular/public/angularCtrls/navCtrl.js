/**
 * Created by emanuel on 4/5/2016.
 */
(function() {
    "use strict";

    //nav tab ctrl//
    function NavCtrl(PhoneBookService) {
        var navVm = this;
        navVm.PhoneBookService = PhoneBookService;

        //constants//
        navVm.GROUPVIEW = "groupView";
        navVm.SHOWCONTACT = "showContact";

        //init//
        navVm.selectedContact = {};
        navVm.activeTab = navVm.PhoneBookService.currentView;
        navVm.keyWordInput = "";
        navVm.keyWord = "";
    }

        //display the tab that active//
        NavCtrl.prototype.isActive = function(selectedTab) {
            var navVm = this;

            //return true for selected tab//
            if(selectedTab == navVm.PhoneBookService.currentView) {
                return true;
            }

            //else tab is not active//
            return false;
        };

        //show regular menu//
        NavCtrl.prototype.notInShowContactMode = function () {
            var navVm = this;
            if(navVm.SHOWCONTACT != navVm.PhoneBookService.currentView) {
                return true;
            }
            this.keyWordInput = "";
            return false;
        };

        //up button clicked//
        NavCtrl.prototype.upSelected = function (groupView) {
            var navVm = this;
            var currentView = navVm.PhoneBookService.currentView;
            navVm.PhoneBookService.setCurrentView(groupView);
            var currentGroup = navVm.PhoneBookService.getCurrentGroup();

            //go up//
            if(navVm.activeTab == currentView) {
                //if view is on root//
                if(!currentGroup.parent) {
                    alert("you are in root group, the highest group, there is no more option to go up!!");
                    return;
                }
                navVm.PhoneBookService.setCurrentGroupById(currentGroup.parent.id);
            }

            //switch tab//
            else {
                navVm.activeTab = navVm.GROUPVIEW;
            }

            //clear data if tab was switched//
            navVm.PhoneBookService.broadcastToReset();
        };

        //add contact selected//
        NavCtrl.prototype.addContactSelected = function (addContact) {
            var navVm = this;
            navVm.PhoneBookService.setCurrentView(addContact);
            navVm.PhoneBookService.broadcastToReset();
        };

        //add group selected//
        NavCtrl.prototype.addGroupSelected = function (addGroup) {
            var navVm = this;
            navVm.PhoneBookService.setCurrentView(addGroup);
            navVm.PhoneBookService.broadcastToReset();
        };

        //search button clicked//
        NavCtrl.prototype.searchSelected = function (search) {
            var navVm = this;

            //handle empty string input//
            if(navVm.keyWordInput == "") {
                alert("empty content is not allowed!!");
                return;
            }

            //update current group to be root//
            navVm.PhoneBookService.changeCurrentGroupToRoot();
            navVm.PhoneBookService.setCurrentView(search);
            navVm.PhoneBookService.keyWord = navVm.keyWordInput;
            navVm.PhoneBookService.searchByKeyword();
            navVm.keyWordInput = "";
            navVm.PhoneBookService.broadcastToReset();
        };
    
    angular.module("phoneBookApp").controller("NavCtrl",["PhoneBookService", NavCtrl]);
})();