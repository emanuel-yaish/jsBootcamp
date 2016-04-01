/**
 * Created by emanuel on 3/22/2016.
 */
var PBApp = PBApp || {};
//return function that initial event click on nav buttons//
PBApp.navCtrl = function() {
      // A $( document ).ready() block.
              //navigation tabs//
              $( ".nav-btn" ).click(function() {
                  //clear fields if press tab and not submitted//
                  $("#inputGroupName").val("");
                  $("#contactNumbersListContainer").empty();
                  $("#firstName").val("");
                  $("#lastName").val("");
                  $("#listOfNumbers").val("");

                  //hide active tab//
                  var active = $(".active");
                  active.removeClass("active")
                  active.addClass("panel");

                  //get new active tab id//
                  var selectedStr = ($(this).attr("data-id"));
                  var selected = $(selectedStr);

                  //display current group in add contact//
                  if(selectedStr == "#addContact") {
                      $("#addContactHeader").text("ADD CONTACT TO: " + PBApp.PhoneBook.currentGroup.name);
                  }

                  //display current group in add group//
                  if(selectedStr == "#addGroup") {
                      $("#addGroupHeader").text("ADD GROUP TO: " + PBApp.PhoneBook.currentGroup.name);
                        //for example move from add group to add contact to delete group name//
                  }

                  //active the new selected tab//
                  selected.removeClass("panel");
                  selected.addClass("active");
              });
};