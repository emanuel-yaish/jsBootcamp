/**
 * Created by emanuel on 3/22/2016.
 */
var PBApp = PBApp || {};

//class addContactView//
PBApp.AddContactView = (function() {
    "use strict";
    var PhoneBook = PBApp.PhoneBook;
    //function constructor of ADD CONTACT//
    function AddContactView(group) {
        //active submit btn and plus btn click event//
        this.onAddContactSubmitClick();
        this.plusBtn();
    }

    //when click to submit new contact//
    AddContactView.prototype.onAddContactSubmitClick = function () {
        //add contact submit btn//
        var thisAddGroupView = this;
            //submit new group//
            $("#createContactBtn").click(function() {
                thisAddGroupView.addContactToPhoneBook();
            });
    };

    //btn that add more inputs fields to add new contact more numbers//
    AddContactView.prototype.plusBtn = function () {
            $("#addNumber").click(function () {
                var numbersContainer = $("#contactNumbersListContainer");
                var inputElement = $("<input/>");
                inputElement.addClass("phone-num");
                numbersContainer.append(inputElement);
            });
    };

    //add new contact to phoneBook//
    AddContactView.prototype.addContactToPhoneBook = function () {
        var firstName = $("#firstName");
        var lastName = $("#lastName");
        var firstNumber = $("#listOfNumbers");

        //handle empty group name//
        if(firstName.val() == "" || lastName.val() == "" || firstNumber.val() == "") {
            alert("you have missing data!");
            return;
        }

        var listOfNumbers = [];
        listOfNumbers.push(firstNumber.val());

        //inserts all numbers to array//
        $("#contactNumbersListContainer input").each(function() {
            var number = $(this).val();
            if(number) {
                listOfNumbers.push($(this).val());
            }
        });

        //create and add the new group to current group//
        PhoneBook.addNewContact(firstName.val(), lastName.val(), listOfNumbers);

        //clear input data//
        firstName.val("");
        lastName.val("");
        firstNumber.val("");
        $("#contactNumbersListContainer").empty();
        PBApp.GroupView.displayCurrentGroup();
    };

    return new AddContactView();
})();


