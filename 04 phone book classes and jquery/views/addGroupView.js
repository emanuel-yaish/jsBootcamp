/**
 * Created by emanuel on 3/22/2016.
 */
var PBApp = PBApp || {};

PBApp.AddGroupView = (function() {
    "use strict";
    var PhoneBook = PBApp.PhoneBook;

    //function constructor of ADD GROUP//
    function AddGroupView() {
        //active submit btn event//
        this.onAddGroupSubmitClick();
    }

    //initialize submit btn//
    AddGroupView.prototype.onAddGroupSubmitClick = function () {
        //submit btn//
        var thisAddGroupView = this;
        $(document).ready(function() {
            //submit new group//
            $("#submitAddGroup").click(function() {
                thisAddGroupView.addGroupToPhoneBook();
            });
        });
    };

    //add new group
    AddGroupView.prototype.addGroupToPhoneBook = function(){
            //get name of the new group from user input//
            var inputGroupName = $("#inputGroupName");
            var groupName = inputGroupName.val();

            //handle empty group name//
            if(groupName == "") {
                alert("group name is empty!");
                return;
            }

            //clear input data//
            inputGroupName.val("");

            //create and add the new group to current group//
            PhoneBook.addNewGroup(groupName);
            PBApp.GroupView.displayCurrentGroup();
    };

    return new AddGroupView();
})();
