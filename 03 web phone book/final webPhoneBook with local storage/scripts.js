/**
 * Created by emanuel on 2/22/2016.
 */
//initialize//
var root = createGroup("Phone book");
var currentGroup = root;
var nextId = 0;

//handle tabs navigation//
function showPanel(id) {
    document.getElementById("showContacts").className = "panel";
    document.getElementById("createContact").className = "panel";
    document.getElementById("createGroup").className = "panel";
    document.getElementById("searchResults").className = "panel";

    if(id != "deleteGroup" ) {
        document.getElementById(id).className = "active";
    }

    if(id == "showContacts") {
        showContacts();
    }

    if(id == "deleteGroup") {
        document.getElementById("showContacts").className = "active";
        if(currentGroup == root) {
            alert("delete root group is not allowed!!");
            showContacts();
            return;
        }

        deleteCurrentGroup();
        showContacts();
        createGroupNav();
    }
}

//default value of root//
function resetToDefault() {
        root.items = [];
        currentGroup = root;
        document.getElementById("currentGroupHeader").innerHTML = currentGroup.name;
        nextId = 0;

        //root group values//
        addNewContact("Emanuel", "Yaish",[123,456,789]);
        addNewContact("Avram", "Avram",[12323,45623,78923]);
        addNewGroup("Friends");

        //group friends//
        currentGroup = currentGroup.items[2];

        //group friends values//
        addNewContact("Moshe", "Yaish",[123,456,789]);
        addNewContact("Yacov", "Besig",[12323,45623,78923]);
        addNewGroup("Best Friends");

        //best friends group//
        currentGroup = currentGroup.items[2];

        //best friends group values//
        addNewContact("Menahem", "Nahum",[123,456,789]);
        addNewContact("Yehosua", "Haparua",[12323,45623,78923]);

        currentGroup = currentGroup.parent;

        addNewGroup("Business Partners");

        //group Business Partners//
        currentGroup = currentGroup.items[3];

        addNewContact("Harel", "Joy",[123,456,789]);
        addNewContact("Shir", "Levi",[12323,45623,78923]);

        currentGroup = root;

        addNewGroup("Work");

        //group Work//
        currentGroup = currentGroup.items[3];

        addNewContact("Dana", "Cohen",[123,456,789]);
        addNewGroup("Co-Workers");

        //group Co-Workers//
        currentGroup = currentGroup.items[1];

        addNewContact("Yerahmiel", "Moshon",[123,456,789]);
        addNewContact("Goaln", "Yosef",[12323,45623,78923]);
        addNewContact("Tali", "Levi",[12323,45623,78923]);

        currentGroup = root;

        //active show contacts//
        showPanel('showContacts');
        saveDataToLocalStorage();
}

//add new contact to phone book
function addNewContact(firstName, lastName, phoneNumbers){
    var contact = createContact(firstName, lastName, phoneNumbers)
    addItem(contact);
}

//add new group to phone book//
function addNewGroup(name){
    var group = createGroup(name);
    addItem(group);
    createGroupNav();
}

//create new contact//
function createContact(firstName, lastName, phoneNumbers) {
    var contact = {
        id: generateNextId(),
        firstName: firstName,
        lastName: lastName,
        phoneNumbers: phoneNumbers,
        type: 'contact',
    };
    return contact;
}

//create new group//
function createGroup(name) {
    var group = {
        id: generateNextId(),
        name: name,
        type: 'Group',
        items: [],
    };
    return group;
}

//add item to phone book//
function addItem(item) {
    if(item.currentGroup){
        throw Error('Item with id ' + item.id + ' was already added to group: ' + item.currentGroup.id);
    }
    currentGroup.items.push(item);
    item.parent = currentGroup;
}

//forward item id by 1//
function generateNextId(){
    return nextId++;
}

//create table row for contact table//
function createTableRow(contactsTable, contact) {
    var tr = document.createElement("tr");

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.id);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.firstName);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.lastName);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.phoneNumbers);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var anchor = document.createElement("a");
    anchor.innerHTML = "delete";
    anchor.data = contact.id;
    anchor.href = "#";

    anchor.addEventListener("click", function(e){

        deleteContact(e.target.data);
    });

    td.appendChild(anchor);
    tr.appendChild(td);

    contactsTable.appendChild(tr);
}

//show contact in contact section//
function showContacts() {
    var contactsTable = document.getElementById("contactsTable");

    //clear tab if clicked again//
    contactsTable.innerHTML = "";

    for(var contactIndex = 0; contactIndex < currentGroup.items.length; contactIndex++ ) {
        if (currentGroup.items[contactIndex].type == "contact") {
             createTableRow(contactsTable, currentGroup.items[contactIndex]);
        }
    }
}

//event add new contact when the user submit it//
function addNewContactFromSubmit(e) {
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var listOfNumber = document.getElementById("listOfNumbers");

    var firstNameTxt = firstName.value
    var lastNameTxt = lastName.value
    var listOfNumberTxt = listOfNumber.value

    if(firstNameTxt == "" || lastNameTxt =="" || listOfNumberTxt == "") {
        alert("Missing Data!!");
        return;
    }

    var listOfNumber = document.getElementById("contactNumbersListContainer");
    var ElementItems = listOfNumber.childNodes;
    var contactListOfNumber = [];

    contactListOfNumber.push(listOfNumberTxt);

    for(var numbersContainerIndex = 0; numbersContainerIndex < ElementItems.length; numbersContainerIndex++) {
        if(ElementItems[numbersContainerIndex].tagName == "INPUT")
            if(ElementItems[numbersContainerIndex].value != "") {
                contactListOfNumber.push(ElementItems[numbersContainerIndex].value);
            }
    }

    //add the contact with first name last name and array of numbers//
    addNewContact(firstNameTxt, lastNameTxt, contactListOfNumber);

    firstName.value = "";
    lastName.value = "";
    var firstNumber = document.getElementById("listOfNumbers");
    firstNumber.value = "";
    listOfNumber.innerHTML = "";

    showContacts();
    showPanel('showContacts');
}

//event add new group when the user submit it//
function addNewGroupFromSubmit(e) {
    var groupName = document.getElementById("groupName");
    var groupNameTxt = groupName.value;

    if(groupNameTxt == "") {
        alert("Missing Group Name!!");
        return;
    }
    addNewGroup(groupNameTxt);
    newGroupId = nextId - 1;
    groupName.value = "";

    currentGroup = getGroupById(root, newGroupId);

    document.getElementById("currentGroupHeader").innerHTML = groupNameTxt;
}

//search and return group from the root by id//
function getGroupById(group, id) {
    if(isNaN(id)) {
        return root;
    }
    var res = null;

    for(var index = 0; index < group.items.length; index++ ) {
        if(group.items[index].type == "Group") {
            if(group.items[index].id == id) {
                return group.items[index];
            }
            else {
                res = getGroupById(group.items[index], id);
                if(res) {
                    return res;
                }
            }
        }
    }
    return null;
}

//create group Navigation//
function createGroupNav() {

    var groupsList = document.getElementById("groupsList");
    groupsList.innerHTML = "";

    createRootInGroupTree();

    var rootGroupsList = document.getElementById("rootGroupsList");
    buildGroupTree(root, rootGroupsList);
}

//add the root group for the tree group navigation//
function createRootInGroupTree() {
    var groupsList = document.getElementById("groupsList");
    groupsList.innerHTML = "";

    var listItem = document.createElement("li");
    var anchor = document.createElement("a");
    anchor.innerText = root.name;
    anchor.id = root.id;
    anchor.href = "#";

    anchor.addEventListener("click", function(e){
        updateCurrentGroup(e);
        showPanel('showContacts');
    });

    var ul = document.createElement("ul");
    ul.id = "rootGroupsList";

    listItem.appendChild(anchor);
    listItem.appendChild(ul);
    groupsList.appendChild(listItem);
}

//build the group tree navigation//
function buildGroupTree(group, element) {
    for(var index = 0 ; index < group.items.length; index++) {
        if(group.items[index].type == "Group") {
            var listItem = document.createElement("li");
            var anchor = document.createElement("a");
            anchor.innerText = group.items[index].name;
            anchor.id = group.items[index].id;
            anchor.href = "#";

            anchor.addEventListener("click", function (e) {
                updateCurrentGroup(e);
                showPanel('showContacts');
            });

            listItem.appendChild(anchor);
            var hasGroupChild = checkIfHasGroupInItems(group.items[index]);
            if(hasGroupChild)   {
                var ul = document.createElement("ul");
                listItem.appendChild(ul);
                buildGroupTree(group.items[index], ul);
        }
            element.appendChild(listItem);
        }
    }
}

//check if group have more groops inside of it//
function checkIfHasGroupInItems(group) {
    for(var i = 0 ; i < group.items.length; i++) {
        if(group.items[i].type == "Group") {
            return true;
        }
    }
    return false;
}

//update the current group to be the new group from the event//
function updateCurrentGroup(e) {
    var groupNameTxt = e.currentTarget.innerHTML;
    currentGroup = getGroupById(root, e.currentTarget.id);
    document.getElementById("currentGroupHeader").innerHTML = groupNameTxt;
}

//delete current group from phone book//
function deleteCurrentGroup() {
    var groupIdToDelete = currentGroup.id;
    currentGroup = currentGroup.parent;
    document.getElementById("currentGroupHeader").innerHTML = currentGroup.name;

    for(var index = 0; index < currentGroup.items.length; index++) {
        if(currentGroup.items[index].id == groupIdToDelete) {
            currentGroup.items.splice(index,1);
            saveDataToLocalStorage();
            return;
        }
    }
}

//delete contact from show contact table//
function deleteContact(contactToDelete) {
    for (var contactIndex = 0; contactIndex < currentGroup.items.length; contactIndex++) {
        if (currentGroup.items[contactIndex].id == contactToDelete) {
            currentGroup.items.splice(contactIndex, 1);
            showContacts();
            saveDataToLocalStorage();
            return;
        }
    }
}

//implement search by name//
function search(group, name) {
    for(var i = 0 ; i < group.items.length; i++) {
        if(group.items[i].type == "contact") {
            if(group.items[i].firstName.toLowerCase() == name.toLowerCase() || group.items[i].lastName.toLowerCase() == name.toLowerCase()) {
                saveContactToTable(group.items[i]);
            }
        }

        // item is a group //
        else {
            if(group.items[i].name.toLowerCase() == name.toLocaleLowerCase()) {
                saveGroupToTable(group.items[i]);
            }
            search(group.items[i], name);
        }
    }
}

//create row for search results contact table//
function saveContactToTable(contact) {
    var searchContactsTable = document.getElementById("searchResultsOFContactsTable");
    createContactSearchTableRow(searchContactsTable, contact);
}

//create row for search results group table//
function saveGroupToTable(group) {
    var searchGroupsTable = document.getElementById("searchResultsOFGroupsTable");
    createGroupsSearchTableRow(searchGroupsTable, group);
}

//create the table for the search results of contacts//
function createContactSearchTableRow(contactsTable, contact) {
    var tr = document.createElement("tr");

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.id);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.firstName);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.lastName);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.phoneNumbers);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(contact.parent.name);

    td.appendChild(txt);
    tr.appendChild(td);

    contactsTable.appendChild(tr);
}

//create the table for the search results of groups//
function createGroupsSearchTableRow(groupsTable, group) {
    var tr = document.createElement("tr");

    var td = document.createElement("td");
    var txt = document.createTextNode(group.id);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(group.name);
    td.appendChild(txt);
    tr.appendChild(td);

    var td = document.createElement("td");
    var txt = document.createTextNode(group.parent.name);
    td.appendChild(txt);
    tr.appendChild(td);

    groupsTable.appendChild(tr);
}

//add number input element//
function addNewNumberFiled() {
    var newFiled = document.getElementById("contactNumbersListContainer");
    var input = document.createElement("input");
    input.type = "text";
    input.className = "input-txt";
    newFiled.appendChild(input);
}

//main//
function run () {
    //create default phone book//
    root.items = [];
    getDataFromLocalStorage();

    showContacts();
    document.getElementById("showContacts").className = "active";

    //build the directory tree//
    createGroupNav();

    //event contact form//
    var createContactForm = document.getElementById("createContactForm");
    createContactForm.addEventListener("submit", function(eCreateContact){
        eCreateContact.preventDefault();
        addNewContactFromSubmit(eCreateContact);
        saveDataToLocalStorage();
    });

    //event contact group//
    var createContactForm = document.getElementById("createGroup");
    createContactForm.addEventListener("submit", function(eCreateGroup){
        eCreateGroup.preventDefault();
        addNewGroupFromSubmit(eCreateGroup);
        saveDataToLocalStorage();
    });

    //event contact add number btn//
    var addNumber = document.getElementById("addNumber");
    addNumber.addEventListener("click", function(eAddNumber){
        eAddNumber.preventDefault();
        addNewNumberFiled();
    });

    //event search button//
    var searchBtn = document.getElementById("searchBtn");
    searchBtn.addEventListener("click", function(eSearch){
        var searchInputTxt = document.getElementById("searchInput").value;

        showPanel("searchResults");

        //clean results from search table
        var searchContactsTable = document.getElementById("searchResultsOFContactsTable");
        searchContactsTable.innerHTML = "";

        var searchGroupsTable = document.getElementById("searchResultsOFGroupsTable");
        searchGroupsTable.innerHTML = "";

        search(root,searchInputTxt);

        if(searchGroupsTable.innerHTML == "" && searchContactsTable.innerHTML == "" ) {
            alert("The Name Is Not Exist!!")
        }

        document.getElementById("searchInput").value = "";
    });

}

// load data from local storage if data from local is not exist loading data from default//
function getDataFromLocalStorage() {
    var ROOT = 0;
    var retrievedObject = '';
    var indexObj = {index: 1}

    // Retrieve the object from storage//
    retrievedObject = localStorage.getItem('phoneBookObject');

    if(!retrievedObject) {
        resetToDefault();
        return;
    }

    // Retrieve the object from storage//
        phoneBookObj = JSON.parse(retrievedObject);

        if(phoneBookObj) {
            convertObjectToPhoneBook(phoneBookObj, indexObj, phoneBookObj[ROOT].numOfItems);
        }
}

//save phone book in local storage//
function saveDataToLocalStorage() {
    var data = [];

    //get the phoneBook in a string//
    convertPhoneBookToJson(root, data);

    // Put the object into storage
    localStorage.setItem("phoneBookObject", JSON.stringify(data));
}

//from phone book to object and json//
function convertPhoneBookToJson(group, data) {
    var itemLength = 0;

    //get the num of group items//
    if(group.items) {
        itemLength = group.items.length;
    }

    //create stirng fron the object//
    var groupObj = { name: group.name, type: group.type, numOfItems: itemLength };

    data.push(groupObj);

    //get all contacts of a group//
    for(var contactsIndex = 0; contactsIndex < itemLength ; contactsIndex ++) {
        if(group.items[contactsIndex].type == 'contact') {
            var contactObj = {firstName:group.items[contactsIndex].firstName, lastName:group.items[contactsIndex].lastName,
                phoneNumbers: group.items[contactsIndex].phoneNumbers, type:group.items[contactsIndex].type };

            data.push(contactObj);
        }
    }
    //save next group//
    for(var groupIndex = 0; groupIndex < itemLength ; groupIndex ++) {
        if(group.items[groupIndex].type == 'Group' ) {
            convertPhoneBookToJson(group.items[groupIndex], data);
        }
    }
}

//from object to phoneBook object//
function convertObjectToPhoneBook(phoneBookObj,indexObj, numOfChildrens) {
    while(indexObj.index < phoneBookObj.length && numOfChildrens > 0) {
        //if item is contact//
        if(phoneBookObj[indexObj.index].type == 'contact') {
            addContactFromObject(phoneBookObj[indexObj.index].firstName, phoneBookObj[indexObj.index].lastName, phoneBookObj[indexObj.index].phoneNumbers);
            numOfChildrens--;
            indexObj.index++;
        }
        else {
            //create new group and add it to root//
            var newGroupName = phoneBookObj[indexObj.index].name;
            var id = nextId;
            addGroupFromObject(newGroupName);
            var newGroupNumOfItems = phoneBookObj[indexObj.index].numOfItems;
            numOfChildrens--;
            indexObj.index++;

            //set current group to be the new group//
            currentGroup = getGroupById(currentGroup, id);

            //net group items//
            convertObjectToPhoneBook(phoneBookObj, indexObj, newGroupNumOfItems);

            //return current group to be the original current group//
            currentGroup = currentGroup.parent;
        }
    }
}

//add contact when build from local storage//
function addContactFromObject(firstName, lastName, phoneNumbers) {
    var contact = createContact(firstName, lastName, phoneNumbers);
    addItem(contact);
}

//add group when build from local storage//
function addGroupFromObject(newGroupName) {
    var group = createGroup(newGroupName);
    addItem(group);
}

//start phone book script//
run();