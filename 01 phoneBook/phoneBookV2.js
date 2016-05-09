/**
 * Created by emanuel on 2/16/2016.
 */

var readlineSync = require('readline-sync');


function findIndexById(arr, idToFind) {
    for(var i = 0 ; i < arr.length ; i++) {
        if(arr[i].counterId == idToFind) {
            return i;

        }
    }
    // if not found//
    return -1;
}

function deleteGroupContacts(contacts, idToDelete) {
    for(var contactIndex = 0; contactIndex < contacts; contactIndex++) {
        if(contacts[contactIndex].groupId == idToDelete) {
            phoneBook.groups.splice(contactIndex,1);
            contactIndex--;
        }
    }

}



function findGroupToDelete(phoneBook, idToDelete) {
    var i = findIndexById(phoneBook.groups, idToDelete);
    phoneBook.groups.splice(i,1);
    if(idToDelete == phoneBook.currentGroupId) {
        phoneBook.currentGroupId = 0;
    }

    deleteGroupContacts(phoneBook.contacts, idToDelete);

    for(var groupIndex = 0; groupIndex < phoneBook.groups.length; groupIndex++) {
        if(phoneBook.groups[groupIndex].parentId == idToDelete) {
            findGroupToDelete(phoneBook, phoneBook.groups[groupIndex].counterId);
            groupIndex--;
        }
    }
}


//find Item by name return true or false//
function findInContacts(contacts, itemToFind) {
    //if item was not found//
    var exist = false;

    for(var contactIndex = 0;contactIndex < contacts.length ; contactIndex++ ) {
        if(contacts[contactIndex].firstName.toLowerCase() == itemToFind.toLowerCase() || contacts[contactIndex].lastName.toLowerCase() == itemToFind.toLowerCase() ) {
            console.log('Search found the contact: ' + contacts[contactIndex].firstName + ' ' + contacts[contactIndex].lastName + '.');
            exist = true;
        }
    }
    return exist;
}


//find Item by name return true or false//
function findInGroups(groups, itemToFind) {
    //if item was not found//
    var exist = false;

    for(var groupsIndex = 0;groupsIndex < groups.length ; groupsIndex++ ) {
        if(groups[groupsIndex].groupName.toLowerCase() == itemToFind.toLowerCase()) {
            console.log('search found the group: ' + groups[groupsIndex].groupName + '.');
            exist = true;
        }
    }
    return exist;
}



//prints contacts names of given group id//
function printContactsName(contactsArray, groupId, indent) {
    for (var contactIndex = 0; contactIndex < contactsArray.length; contactIndex++) {
        if(groupId == contactsArray[contactIndex].groupId)
        console.log(indent + contactsArray[contactIndex].firstName + " " + contactsArray[contactIndex].lastName + ".");
    }
}

//return group by id return false if not exist//
function findGroupById(phoneBook, groupId) {
    for(var i=0; i<phoneBook.groups.length ;i++) {
        if(groupId == phoneBook.groups[i].counterId)
            return phoneBook.groups[i];
    }

    return false;
}

//generate new group//
function createNewGroup(phoneBook, groupName){
    return {
        counterId: phoneBook.counterId++,
        groupName: groupName,
        parentId: phoneBook.currentGroupId
    }
}

//generate new person//
function createNewPerson(phoneBook, firstN, lastN, numbers){
    return {
        counterId: phoneBook.counterId++,
        firstName: firstN,
        lastName:  lastN,
        numbersList: numbers,
        groupId: phoneBook.currentGroupId
    }
}

//***************************  1 - 8  ********************************//

// Add New Person //
function addNewPerson(phoneBook) {

    //******* input from user *****//
    var firstN = readlineSync.question('Please enter first name. :');
    var lastN = readlineSync.question('Please enter last name. :');
    var numbers = readlineSync.question('Please enter a list of phone numbers separated by commas. :');
    var numbersList = numbers.split(',');


    //***** add new contact *****//
    phoneBook.contacts.push(createNewPerson(phoneBook, firstN, lastN, numbersList))
}

// Add New Group //
function addNewGroup(phoneBook) {

    //input from user//
    var groupName = readlineSync.question('please enter new group name. :');

    //create and add the new group//
    phoneBook.groups.push(createNewGroup(phoneBook, groupName));
}

// Change Current Group //
function changeCurrentGroup(phoneBook) {

    //get input from the user//
    var newCurrentGroupName = readlineSync.question('please enter a name of exists group. :');

    //if user want to go parent group//
    if (newCurrentGroupName == '..') {
        if(phoneBook.currentGroupId != 0) {
            var currentGroup = findGroupById(phoneBook, phoneBook.currentGroupId);
            phoneBook.currentGroupId = currentGroup.parentId;
        }
        else {
            console.log('This group is not inside other group!');
        }
    }
    //else find new current gorup in current group groups//
    else {

        for (var i = 0; i < phoneBook.groups.length; i++) {
            if (phoneBook.groups[i].parentId == phoneBook.currentGroupId && newCurrentGroupName == phoneBook.groups[i].groupName) {
                 phoneBook.currentGroupId = phoneBook.groups[i].counterId;
                 return ;
            }
        }

        console.error("error! group name does not exist");

    }

}

// Print Current Group //
function printCurrentGroup(phoneBook) {

    //get and print current group name//
    var currentGroup = findGroupById(phoneBook, phoneBook.currentGroupId);
    console.log("you are current in group:" + currentGroup.groupName);

    console.log("list of sub groups :")
    console.log('--------------');
    for (var groupIndex=0; groupIndex < phoneBook.groups.length; groupIndex++) {
        if(phoneBook.groups[groupIndex].parentId == phoneBook.currentGroupId) {
            console.log('group name : ' + phoneBook.groups[groupIndex].groupName);
            console.log('group ID : ' + phoneBook.groups[groupIndex].counterId);
            console.log('--------------');
        }
    }
    console.log("list of sub contacts :");
    console.log('--------------');
    for (var contactIndex=0; contactIndex < phoneBook.contacts.length; contactIndex++) {
        if (phoneBook.contacts[contactIndex].groupId == phoneBook.currentGroupId) {
            console.log('contact first name :' + phoneBook.contacts[contactIndex].firstName);
            console.log('contact last name :' + phoneBook.contacts[contactIndex].lastName);
            console.log('contact numbers :' + phoneBook.contacts[contactIndex].numbersList);
            console.log('contact ID :' + phoneBook.contacts[contactIndex].counterId);
            console.log('--------------');
        }
    }
}

// Print All //
function printAll(phoneBook, currentGroupId, indent) {

    var group = findGroupById(phoneBook, currentGroupId);
    console.log(indent + group.groupName);
    indent = indent + '\t';

    printContactsName(phoneBook.contacts, currentGroupId, indent);

    for(var groupIndex = 0; groupIndex < phoneBook.groups.length; groupIndex++) {
        if(phoneBook.groups[groupIndex].parentId == currentGroupId) {
            printAll(phoneBook, phoneBook.groups[groupIndex].counterId, indent);
        }
    }
}

//find item by name
function find(phoneBook) {

    var contactExist =false;
    var groupExist = false;

    //get input from the user//
    var itemToFind = readlineSync.question('please enter a name of exists item. :');


    groupExist = findInGroups(phoneBook.groups, itemToFind);
    contactExist = findInContacts(phoneBook.contacts, itemToFind);

    if(groupExist == false && contactExist == false)
    {
        console.error("Error: item is not Exist!");
    }
}

// Delete Item//
function deleteItem(phoneBook) {


    //get input from the user//
    var itemToDelet = readlineSync.question('please enter Id to delete. :');

    if(itemToDelet <= 0){
        console.error('Item ID must be greater than 0');
        return;
    }

    //search the id in the contacts array return the location or -1 if not inside contacts.//
    var iContact = findIndexById(phoneBook.contacts, itemToDelet);

    //if item to delete inside contacts//
    if(iContact != -1) {
        //remove the item//
        phoneBook.contacts.splice(iContact,1);
        return;
    }
    //else if not in contacts//
    else {
        //search the id in the Groups array return the location or -1 if not inside Groups.//
        var iGroup = findIndexById(phoneBook.groups, itemToDelet);
        //if the item is not in groups//
        if(iGroup == -1) {
            //the item is not exist//
            console.error('Error: Item Id is not Exist!!.');
            return;
        }
    }
    //if the item is a group//
    findGroupToDelete(phoneBook, itemToDelet);
}


// main Function//
function main() {

    //consts//
    const ROOT = 0;
    const ADD_NEW_PERSON = '1';
    const ADD_NEW_GROUP = '2';
    const CHANGE_CURRENT_GROUP = '3';
    const PRINT_CURRENT_GROUP = '4';
    const PRINT_ALL = '5';
    const FIND = '6';
    const DELETE_ITEM = '7';
    const EXIT = '8';



    //initializing//
        var indent = '';
        var hold = "";
        //crate the root//
        var phoneBook ={
            counterId: ROOT,
            currentGroupId: -1,
            contacts: [],
            groups: []
        }
        //add the root to groups array
        phoneBook.groups.push(createNewGroup(phoneBook,"phoneBook"));
        //root//
        phoneBook.currentGroupId = ROOT;





    var choice = -1;
    while(choice != 8) {


        console.log("\nmenu:\n" +
            "1)Add new person. \n" +
            "2)Add new group. \n" +
            "3)Change current group. \n" +
            "4)Print current group. \n" +
            "5)Print All. \n" +
            "6)Find. \n" +
            "7)Delete item. \n" +
            "8)Exit. \n"
        );

        //get and print current group name//
        var currentGroup = findGroupById(phoneBook, phoneBook.currentGroupId);
        console.log("you are current in group:" + currentGroup.groupName);

        choice = readlineSync.question('please select your choice  :');
        console.log(choice);



        //menu//
        switch (choice) {
            case ADD_NEW_PERSON :
                addNewPerson(phoneBook);
                hold = readlineSync.question('press Enter to continue.');
                break;

            case ADD_NEW_GROUP :
                addNewGroup(phoneBook);
                hold = readlineSync.question('press Enter to continue.');
                break;

            case CHANGE_CURRENT_GROUP :
                changeCurrentGroup(phoneBook);
                hold = readlineSync.question('press Enter to continue.');
                break;

            case PRINT_CURRENT_GROUP :
                printCurrentGroup(phoneBook);
                hold = readlineSync.question('press Enter to continue.');
                break;

            case PRINT_ALL :
                indent = '';
                printAll(phoneBook, ROOT, indent);
                hold = readlineSync.question('press Enter to continue.');
                break;

            case FIND :
                find(phoneBook);
                hold = readlineSync.question('press Enter to continue.');
                break;


            case DELETE_ITEM :
                deleteItem(phoneBook);
                hold = readlineSync.question('press Enter to continue.');
                break;

            case EXIT :
                console.log("goodbye");
                break;

            default:
                console.log("your choice does not exist please choose again :");
                break;
        }
    }
}


main();