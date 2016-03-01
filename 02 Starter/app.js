var rl = require('readline-sync');
var fs = require('fs');


var root = createGroup("~");
var currentGroup = root;
var nextId = 0;

var Menu = {
    ADD_NEW_CONTACT: 1,
    ADD_NEW_GROUP: 2,
    CHANGE_CURRENT_GROUP: 3,
    PRINT: 4,
    PRINT_ALL: 5,
    FIND: 6,
    DELETE: 7,
    EXIT: 8
};

function printMenu() {
    console.log();
    console.log("1) Add new contact");
    console.log("2) Add new group");
    console.log("3) Change current group");
    console.log("4) Print");
    console.log("5) Print All");
    console.log("6) Find");
    console.log("7) Delete");
    console.log("8) Exit");
}

function run(){
    loadData();
    while(true) {
        printMenu();

        var command = rl.question('Contact Book> ');
        handleCommand(command);
    }
}


function findGroup(currentGroup, name) {
    if(name == '..') {
        return currentGroup.parent;
    }


    for(var findGroupIndex = 0 ; findGroupIndex < currentGroup.items.length; findGroupIndex ++) {
        if(currentGroup.items[findGroupIndex].type == 'Group') {
            if(currentGroup.items[findGroupIndex].name == name) {
                return currentGroup.items[findGroupIndex];

            }

        }
    }//end of for//

    return null;

}//end of findGroup//



function handleCommand(line) {
    var command = parseInt(line);
    var indent = '';

    if (command == Menu.ADD_NEW_CONTACT) {
        addNewContact();
    }
    else if(command == Menu.ADD_NEW_GROUP) {
        addNewGroup();
    }
    else if(command == Menu.CHANGE_CURRENT_GROUP) {
        changeCurrentGroup();
        console.log(currentGroup.name)
    }
    else if(command == Menu.PRINT) {
        console.log('you are in current group: ' + currentGroup.name);
        print();
    }
    else if(command == Menu.PRINT_ALL) {
        indent = '';
        printAll(root, indent);
    }
    else if(command == Menu.FIND) {
        find();
    }
    else if(command == Menu.DELETE) {
        deleteItem();
    }
    else if(command == Menu.EXIT) {
        exit();
    }
}

function addNewContact(){
    var firstName = readNonEmptyString('First Name: ');
    var lastName = readNonEmptyString('Last Name: ');

    var phoneNumbers = [];
    while(true){
        var phoneNumber = rl.question('Phone Number (press enter when done): ');
        if(!phoneNumber){
            break;
        }

        phoneNumbers.push(phoneNumber);
    }

    var contact = createContact(firstName, lastName, phoneNumbers)
    addItem(contact);
}

function addNewGroup(){
    var name = readNonEmptyString('Name: ');

    var group = createGroup(name);
    addItem(group);
}

function changeCurrentGroup(){
    var name = readNonEmptyString('Name: ');
    if(name == ".."){
        if(!currentGroup.parent){
            return;
        }

        currentGroup = currentGroup.parent;
    }
    else {
        var subGroup = findGroup(currentGroup, name);
        if(!subGroup){
            console.log('Group with name ' + name + ' was not found')
            return;
        }

        currentGroup = subGroup;
    }}

function print() {
    for(var item in currentGroup.items){
        if(currentGroup.items[item].type == 'Group'){
            printGroup(currentGroup.items[item]);
        }
        else{
            printContact(currentGroup.items[item]);
        }
    }
}

function printAll(group, indent) {
    console.log(indent + group.name);
    indent += '\t';
    for(var contactsIndex = 0; contactsIndex <group.items.length ; contactsIndex ++) {
        if(group.items[contactsIndex].type == 'contact') {
            console.log(indent + group.items[contactsIndex].firstName + ' ' + group.items[contactsIndex].lastName + '.')
        }
    }


        for(var groupIndex = 0; groupIndex <group.items.length ; groupIndex ++) {
            if(group.items[groupIndex].type == 'Group' ) {
                printAll(group.items[groupIndex], indent);
         }


    }

}

function find(){
    //no need to implement//
}

function deleteItem(){

    var idToDelete = readNonEmptyString('please Enter ID to delete: ');

    findItemToDelete (root, idToDelete);

    //current group always back to root//
    currentGroup = root;

}

function exit(){
    saveToFile();
    process.exit(0);
}

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

function createGroup(name) {
    var group = {
        id: generateNextId(),
        name: name,
        type: 'Group',
        items: [],
    };

    return group;
}

function addItem(item) {
    if(item.currentGroup){
        throw Error('Item with id ' + item.id + ' was already added to group: ' + item.currentGroup.id);
    }

    currentGroup.items.push(item);

    item.parent = currentGroup;
}

function generateNextId(){
    return nextId++;
}

function printGroup(group){
    console.log(group.name);
}

function printContact(contact){
    console.log(contact.firstName + ' ' + contact.lastName);
}

function readNonEmptyString(message) {
    while(true) {
        var line = rl.question(message).trim();
        if(line){
            return line;
        }
    }
}



function addContactFromObject(firstName, lastName, phoneNumbers) {
    var contact = createContact(firstName, lastName, phoneNumbers);
    addItem(contact);
}


function addGroupFromObject(newGroupName) {
    var group = createGroup(newGroupName);
    addItem(group);
}



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
            addGroupFromObject(newGroupName);
            var newGroupNumOfItems = phoneBookObj[indexObj.index].numOfItems;
            numOfChildrens--;
            indexObj.index++;



            //set current group to be the new group//
            currentGroup = findGroup(currentGroup, newGroupName);

            //net group items//
            convertObjectToPhoneBook(phoneBookObj, indexObj, newGroupNumOfItems);

            //return current group to be the original current group//
            currentGroup = findGroup(currentGroup, '..');

            }


        }

}


// load data from file if file is not valid continue without loading data from file//
function loadData() {

    var ROOT = 0;
    var phoneBookObj = '';
    var indexObj = {index: 1}

    try {

        var content = fs.readFileSync('myFile.txt', 'utf8');

    }

    catch(err) {
        content = 'empty';
        console.log('File is not Exist!! continue without loading data from file');
    }



    console.log('File Content: ' + '\n' + content);


    if(content) {
        try {
            phoneBookObj = JSON.parse(content);
        }

        catch (err) {
            console.log('Check your Data continue without loading Data from file');
        }
    }

    if(phoneBookObj) {
        convertObjectToPhoneBook(phoneBookObj, indexObj, phoneBookObj[ROOT].numOfItems);
    }


}

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

//save phoneBook to file before exit//
function saveToFile() {

    var data = [];

    //get the phonebook in a string//
    convertPhoneBookToJson(root, data);

    //write to file//
    fs.writeFileSync('myFile.txt', JSON.stringify(data));

}


function findItemToDelete (group, idToDelete) {

    //check current group//

    for(var contactsIndex = 0; contactsIndex <group.items.length ; contactsIndex ++) {
        if(group.items[contactsIndex].type == 'contact' ) {
            if (group.items[contactsIndex].id == idToDelete) {
                group.items.splice(contactsIndex, 1);
                return;
            }
        }
    }


    for(var groupIndex = 0; groupIndex <group.items.length ; groupIndex ++) {
        if(group.items[groupIndex].type == 'Group' ) {
            if(group.items[groupIndex].id == idToDelete ) {
                group.items.splice(groupIndex, 1);
                return;
            }

            findItemToDelete(group.items[groupIndex], idToDelete);
        }


    }


}


run();
