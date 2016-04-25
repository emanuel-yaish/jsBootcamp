/**
 * Created by emanuel on 4/12/2016.
 */
(function() {
    "use strict";
    
    //add contact ctrl//
    function AddContactCtrl(PhoneBookService, $scope) {
        var addContactVm = this;

        //init//
        addContactVm.firstName = "";
        addContactVm.lastName = "";
        addContactVm.firstNum = "";
        addContactVm.phoneNumbers = [];
        addContactVm.PhoneBookService = PhoneBookService;

        //clear data on tab switched//
        $scope.$on('handleBroadcast', function () {
            addContactVm.firstName = "";
            addContactVm.lastName = "";
            addContactVm.firstNum = "";
            addContactVm.phoneNumbers = [];
        });
    }

    //add contact//
    AddContactCtrl.prototype.addNewContact = function() {
        var addContactVm = this;

        if(addContactVm.firstName == "" || addContactVm.lastName == "" || addContactVm.firstNum == "") {
            alert("there is a missing data!! please check all fields.");
            return;
        }

        var listOfPhoneNum = [];
        listOfPhoneNum.push(addContactVm.firstNum);

        for(var index = 0; index < addContactVm.phoneNumbers.length; index++) {
            if(addContactVm.phoneNumbers[index] != "") {
                listOfPhoneNum.push(addContactVm.phoneNumbers[index]);
            }
        }

        addContactVm.PhoneBookService.addContact(addContactVm.firstName, addContactVm.lastName, listOfPhoneNum);
        addContactVm.PhoneBookService.setCurrentView("groupView");
        addContactVm.PhoneBookService.updateServer();
    };

    //add input fields//
    AddContactCtrl.prototype.addNumber = function () {
        var addContactVm = this;
        addContactVm.phoneNumbers.push("");
    };

    angular.module("phoneBookApp").controller("AddContactCtrl", AddContactCtrl);
})();
