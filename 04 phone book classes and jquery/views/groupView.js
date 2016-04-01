/**
 * Created by emanuel on 3/17/2016.
 */
var PBApp = PBApp || {};

PBApp.GroupView = (function() {
    "use strict";
    var PhoneBook = PBApp.PhoneBook;
    //group view function constructor//
    function GroupView() {
        this.init();
        this.onClickUp();
        this.onClickFind();
    }

    //init data for check//
    GroupView.prototype.init = function () {
        PhoneBook.addNewContact("Garry","Fisher",["+972-93243214","+972-31413142"]);
        PhoneBook.addNewContact("Cody","Bass",["972-34133124"]);
        PhoneBook.addNewGroup("groupA");
        PhoneBook.addNewGroup("groupB");
        PhoneBook.addNewContact("Owen","French",["+972-43124123","+972-31243112","+972-14312423","+972-31243332"]);
        PhoneBook.addNewGroup("groupC");
        PhoneBook.addNewContact("Herbert","Gibbs",["+972-41234568","+972-31241123"]);
    };

    //build and display current group in container//
    GroupView.prototype.displayCurrentGroup = function () {
        var currentGroupContainer = $("#groupView");
        currentGroupContainer.empty();
        var currentGroup = PhoneBook.currentGroup;

        //current group header name//
        currentGroupContainer.append("<h3>"+ currentGroup.name +"</h3>")
        currentGroupContainer.append("<ul id='currentGroupUl'></ul>");

        //groups and contacts container//
        var currentGroupUl = $("#currentGroupUl");

        //add container content//
        for(var i = 0; i < currentGroup.items.length; i++) {
            //add group
            if(currentGroup.items[i] instanceof PBApp.Group) {
                currentGroupUl.append(
                    "<li><a class='group-item' href='#' data-id='" + currentGroup.items[i].id +
                    "' +><img src='images/group.png' alt='group-img'/>" + currentGroup.items[i].name +
                    "</a><a class='remove-item' href='#' data-id='" + currentGroup.items[i].id + "' +" +
                    " data-type='#groupView'>delete<img src='images/remove.png' alt='remove-img'/></a></li>");
            }
            //add contact//
            else {
                currentGroupUl.append(
                    "<li><a class='contact-item' href='#' data-id='" +
                    currentGroup.items[i].id + "'><img src='images/contact.png' alt='contact-img'/>" +
                    currentGroup.items[i].firstName + " " + currentGroup.items[i].lastName +
                    "</a><a class='remove-item' href='#' data-id='" + currentGroup.items[i].id +
                    "' + data-type='#groupView'>delete<img src='images/remove.png' alt='remove-img'/></a></li>");
            }
        }
        //init click event listeners//
        this.groupSelected();
        this.contactSelected();
        this.deleteItem();
        this.changeActiveTab("#groupView");
    };

    //up btn//
    GroupView.prototype.onClickUp = function () {
        var groupView = this;
        $("#upBtn").click(function() {
            var activeId = $(".active").attr("id");

            //id view is on add group or contact//
            if(activeId != "groupView"){
                groupView.displayCurrentGroup();
                return;
            }

            //if view is on root//
            if(!PhoneBook.currentGroup.parent) {
                alert("you are in root group, the highest group, there is no more option to go up!!");
                return;
            }

            //update current group for display//
            PhoneBook.currentGroup = PhoneBook.currentGroup.parent;
            groupView.displayCurrentGroup();
        });
    };

    //up from selected contact//
    GroupView.prototype.upFromDisplayContact = function() {
        var groupView = this;
        $("#backBtn").click(function() {
            var groupid = $(this).attr("data-id");
            var newCurrentGroup = PhoneBook.getItemById(groupid);

            //update current group//
            PhoneBook.currentGroup = newCurrentGroup;
            groupView.displayCurrentGroup();

            //delete view//
            $("#contactZoomNav").remove();

            //return the regular nav//
            $("#groupNav").show();
        });
    };

    //view when click on contact//
    GroupView.prototype.displayContact = function(contact) {
        var showContact = $("#showContact");
        showContact.empty();

        //hide the regular nav//
        $("#groupNav").hide();

        //nav for contact view//
        var dataID = "'" + contact.parent.id + "'";
        $("#mainNav").append(
            "<ul id='contactZoomNav'><li><a id='backBtn' data-id=" +
            dataID +" class='nav-btn' href='#'><img class='up-arrow' src='images/up_arrow.png'>" +
            " Up to contact group </a></li></ul>");

        //contact name
        showContact.append(
            "<h3><img src='./images/contact_zoom.png' alt='contact img'>" +
            contact.firstName + " " +
            contact.lastName +
            "</h3><ul id='numbersContainer'></ul>");

        //contact phones list//
        var ul = $("#numbersContainer");
        for(var index = 0; index < contact.phoneNumbers.length; index++ ) {
            ul.append(
                "<li><img src='./images/Phone.png' alt='phone img'>" +
                contact.phoneNumbers[index] + "</li>");
        }
        this.upFromDisplayContact();
    };

    //handle click event on group//
    GroupView.prototype.groupSelected = function() {
        var groupView = this;

        //when group selected//
        $(".group-item").click(function() {
            var groupid = $(this).attr("data-id");
            var newCurrentGroup = PhoneBook.getItemByIdFromCurrentGroup(groupid);

            //update the current group to be the group that selected//
            PhoneBook.currentGroup = newCurrentGroup;
            groupView.displayCurrentGroup();
        });
    };

    //handle click event on contact//
    GroupView.prototype.contactSelected = function() {
        var groupView = this;
        $(".contact-item").click(function() {
            var contactId = $(this).attr("data-id");
            var contact = PhoneBook.getItemByIdFromCurrentGroup(contactId);

            //contact details//
            groupView.displayContact(contact);

            //hide active tab//
            var active = $(".active");
            active.removeClass("active")
            active.addClass("panel");

            //new view to display//
            var showContact = $("#showContact");

            showContact.removeClass("panel");
            showContact.addClass("active");
        });
    };

    //search by keyword and display the results
    GroupView.prototype.onClickFind = function () {
        var groupView = this;

        //event when user submit keyword to find//
        $("#searchBtn").click(function() {
            var keyword = $("#searchInput").val();
            var res = [];
            res = PhoneBook.findItem(keyword);
            $("#searchInput").val("");

            //back to root//
            PhoneBook.currentGroup = PhoneBook.root;
            //display the results
            groupView.displaySearchResult(res, keyword);
        });
    };

    //print the results//
    GroupView.prototype.displaySearchResult = function(res, keyword) {
        var searchResult = $("#searchResult");
        searchResult.empty();

        //if not exists//
        if(res.length == 0) {
            searchResult.append("<p id='notFound'>item not found</p>");
        }
        else {
            searchResult.append("<h3 id='searchHeader' data-keyword='"+ keyword + "'>results for: "+ keyword +"</h3>");
            searchResult.append("<ul id='searchResultsContainer'></ul>");

            //insert the results to ul li
            var searchResultsContainer = $("#searchResultsContainer");
            for (var i = 0; i < res.length; i++) {
                if (res[i] instanceof PBApp.Group) {
                    searchResultsContainer.append(
                        "<li><a class='group-item' href='#' data-id='" +
                        res[i].id + "' +><img src='images/group.png' alt='group-img'/>" +
                        res[i].name + "</a><a class='remove-item' href='#' data-id='" +
                        res[i].id + "' + data-type='#searchResult'>" +
                        "delete<img src='images/remove.png' alt='remove-img'/></li>");
                }
                else {
                    searchResultsContainer.append(
                        "<li><a class='contact-item' href='#' data-id='" +
                        res[i].id + "'><img src='images/contact.png' alt='group-img'/>" +
                        res[i].firstName + " " + res[i].lastName +
                        "</a><a class='remove-item' href='#' data-id='" + res[i].id + "' +" +
                        " data-type='#searchResult'>delete<img src='images/remove.png' alt='remove-img'/></li>");
                }
            }
        }

        //active the results and events//
        var jqueryId = "#searchResult";
        this.changeActiveTab(jqueryId);

        //initial click events//
        this.contactSelected();
        this.groupSelected();
        this.deleteItem();
    };

    //show active tab by selected jquery id//
    GroupView.prototype.changeActiveTab = function (jqueryId) {
        //hide active tab//
        var active = $(".active");
        active.removeClass("active")
        active.addClass("panel");

        //make new active tab//
        var newActive = $(jqueryId);
        newActive.removeClass("panel");
        newActive.addClass("active");
    };

    //delete item when user select delete//
    GroupView.prototype.deleteItem = function() {
        var groupView = this;

        //handle delete event//
        $(".remove-item").click(function() {
            var thisItem =$(this);
            var approved = $("#approved");
            approved.data("id", thisItem.data("id"));
            approved.data("type", thisItem.data("type"));

            //bool for user choice yes no//
            var cancel = false;
            $('#screen, #modal').show();

            //close modal//
            $("#screen, #canceled").click(function() {
                $("#screen, #modal").hide();
                return;
            });

            //handle event user choose yes//
            $("#approved").click(function() {
                $("#screen, #modal").hide();
                var id = $("#approved").data("id");
                groupView.deleteApproved();
            });
        });
    };

    //delete from root after user confirm//
    GroupView.prototype.deleteApproved = function() {
        var approved = $("#approved");
        var itemToDeleteId = approved.data("id");
        PhoneBook.deleteItem(itemToDeleteId);
        var viewType = approved.data("type");

        //handle delete from search results//
        if(viewType == "#searchResult") {
            var keyword = $("#searchHeader").attr("data-keyword");
            var res = PhoneBook.findItem(keyword);
            this.displaySearchResult(res, keyword);
            if(res.length == 0) {
                $("#notFound").text("results for: "+ keyword + " now is empty.");
            }
        }
        else {
            //group selected from group view//
            this.displayCurrentGroup();
        }
    };

    return new GroupView();
})();