/**
 * Created by emanuel on 4/12/2016.
 */
(function() {
    "use strict";

    //add group ctrl//
    function AddGroupCtrl(PhoneBookService ,$scope) {
        var addGroupVm = this;
        addGroupVm.newGroupName = "";
        addGroupVm.PhoneBookService = PhoneBookService;

        //on when tab switched//
        $scope.$on('handleBroadcast', function () {
            addGroupVm.newGroupName = "";
        });
    }

    //add group//
    AddGroupCtrl.prototype.addNewGroup = function() {
        var addGroupVm = this;

        //handle empty string input//
        if(addGroupVm.newGroupName == "") {
            alert("empty group name is not allowed!! ");
            return;
        }

        //add the group to current group//
        addGroupVm.PhoneBookService.addGroup(addGroupVm.newGroupName);
        addGroupVm.newGroupName = "";
        addGroupVm.PhoneBookService.setCurrentView("groupView");
        addGroupVm.PhoneBookService.updateServer();
    };

    angular.module("phoneBookApp").controller("AddGroupCtrl",  AddGroupCtrl);
})();

