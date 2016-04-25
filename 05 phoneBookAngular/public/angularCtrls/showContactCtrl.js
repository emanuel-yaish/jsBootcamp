/**
 * Created by emanuel on 4/14/2016.
 */
(function() {
    "use strict";

    //ShowContact ctrl//
    function ShowContactCtrl(PhoneBookService) {
        var showContactVm = this;
        
        //init//
        showContactVm.PhoneBookService = PhoneBookService;
        showContactVm.selectedContact = showContactVm.PhoneBookService.selectedContact;
    }
    
    //display the tab that active//
    ShowContactCtrl.prototype.isActive = function(selectedTab) {
        var showContactVm = this;

        //show this tab//
        if(selectedTab == showContactVm.PhoneBookService.currentView) {
            return true;
        }

        //else tab is not active//
        return false;
    };
    
    angular.module("phoneBookApp").controller("ShowContactCtrl", ["PhoneBookService", ShowContactCtrl]);
})();