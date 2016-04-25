//add phoneBook data modal//
var PBApp = PBApp || {};

(function() {

    //service//
    function PhoneBookService($rootScope, $http) {

        //CONSTANTS//
        var PHONEBOOK ="phone book";
        var ROOTID = -1;
        
        //init//
        this.currentView = "groupView";
        this.phoneBook =  PBApp.PhoneBook;
        this.currentGroup = this.phoneBook.root;
        this.selectedContact = {};
        this.keyWord = "";
        this.searchResults = [];
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.jsonPhoneBook = {};

        //load data from server to phone book//
        this.initPhoneBook();
    }

    //clear data when switching tabs//
    PhoneBookService.prototype.broadcastToReset = function() {
        var $rootScope = this.$rootScope;
        $rootScope.$broadcast('handleBroadcast');
    };

    //init phone book from the server if file is empty create root//
    PhoneBookService.prototype.initPhoneBook = function () {
        //get data from the server//
        this.getPhoneBookFromServer();
    };

    //get the phone book data from the server//
    PhoneBookService.prototype.getPhoneBookFromServer = function () {
        //get file from the server//
        var phoneBookService = this;

        //http get request//
        this.$http({
                    method: 'GET',
                    url: 'http://localhost:3000/getPhoneBook'
            }).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            
            //data from server//
            phoneBookService.jsonPhoneBook = response.data;
            var phoneBookDataFromServer = phoneBookService.jsonPhoneBook;

            //if the file is empty//
            if(phoneBookDataFromServer == "empty")
            {
                phoneBookService.phoneBook.root = [];
                return;
            }

            if(phoneBookDataFromServer == "" || phoneBookDataFromServer == {}) {
                alert("alert problem with server file");
            }

            //get data and load it//
            phoneBookService.jsonPhoneBook  = phoneBookDataFromServer;
            phoneBookService.loadData();
            
            }, function (response) {
            alert("error to get data from server");
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.});
        });
    };
    
    //http post update the server file when something change//
    PhoneBookService.prototype.updateServer = function () {
        var $http = this.$http;
        var data = [];
        this.convertPhoneBookToJson(this.phoneBook.root,data);
        
        //ajax call//
        $http.post('http://localhost:3000/setPhoneBook', { data: data })
            .success(function () {
                console.log("Transfer completed");
            })
            .error(function () {
                console.log("Transfer failed");
            });
    };

    //add new group service//
    PhoneBookService.prototype.addGroup = function (newGroupName) {
        this.phoneBook.addNewGroup(newGroupName);
    };

    //add new group contact//
    PhoneBookService.prototype.addContact = function (firstName, lastName, phoneNumbers) {
        this.phoneBook.addNewContact(firstName, lastName, phoneNumbers);
    };

    //set current group to be root//
    PhoneBookService.prototype.changeCurrentGroupToRoot = function () {
        this.currentGroup = this.phoneBook.root;
        this.phoneBook.currentGroup = this.phoneBook.root;
    };
    
    //return current group
    PhoneBookService.prototype.getCurrentGroup = function () {
        return this.currentGroup;
    };

    //delete item by id//
    PhoneBookService.prototype.deleteItemById = function(itemIdToDelete){
        this.phoneBook.deleteItem(itemIdToDelete);
    };

    //get item by id//
    PhoneBookService.prototype.getItemById = function(id){
        return this.phoneBook.getItemById(id);
    };

    //set by id current group//
    PhoneBookService.prototype.setCurrentGroupById = function(id){
        this.currentGroup = this.phoneBook.getItemById(id);
        this.phoneBook.currentGroup = this.currentGroup;
    };

    //set selected contact by user click//
    PhoneBookService.prototype.setSelectedContact = function(contact){
        this.selectedContact = contact;
    };

    //return selected contact by the user//
    PhoneBookService.prototype.getSelectedContact = function(){
        return this.selectedContact;
    };

    //set the active tab to present//
    PhoneBookService.prototype.setCurrentView = function(activeTab){
        this.currentView = activeTab;
    };
    
    //set the selected contact and his current group//
    PhoneBookService.prototype.setSelectedContact = function(contactId){
        this.selectedContact = this.getItemById(contactId);

        //change current group to be contact group//
        var parentId = this.selectedContact.parent.id;
        this.setCurrentGroupById(parentId);
    };

    //search item by key word//
    PhoneBookService.prototype.searchByKeyword = function(){
        this.searchResults = [];
        this.searchResults = this.phoneBook.findItem(this.keyWord);
    };

    //save phoneBook to file in the server//
    PhoneBookService.prototype.saveToServer = function() {
        var data = [];
        var root = this.phoneBook.root;
        
        //get the phoneBook in a string//
        this.convertPhoneBookToJson(root, data);
    };

    //convert phone book to json format for saving in the server//
    PhoneBookService.prototype.convertPhoneBookToJson = function(group, data) {
        var itemLength = 0;

        //get the num of group items//
        if(group.items) {
            itemLength = group.items.length;
        }

        //create string from the object//
        var groupObj = { name: group.name, type: group.type, numOfItems: itemLength };

        //add group to array//
        data.push(groupObj);

        //get all contacts of a group//
        for(var contactsIndex = 0; contactsIndex < itemLength ; contactsIndex ++) {
            if(group.items[contactsIndex].type == 'Contact') {
                var contactObj = {firstName:group.items[contactsIndex].firstName, lastName:group.items[contactsIndex].lastName,
                    phoneNumbers: group.items[contactsIndex].phoneNumbers, type:group.items[contactsIndex].type };

                //add contact to array//
                data.push(contactObj);
            }
        }

        //save next group//
        for(var groupIndex = 0; groupIndex < itemLength ; groupIndex ++) {
            if(group.items[groupIndex].type == 'Group' ) {
                this.convertPhoneBookToJson(group.items[groupIndex], data);
            }
        }
    };
    
    // load data from server if data is not valid loading empty phone book//
    PhoneBookService.prototype.loadData = function() {
        //constants//
        var ROOT = 0;
        
        //init//
        var phoneBookObj = {};
        var indexObj = {index: 1}
        
       // var phoneBookObj = JSON.parse(this.jsonPhoneBook);
        var phoneBookObj = this.jsonPhoneBook;
        
        //handle file convert//
        try {
            this.convertObjectToPhoneBook(phoneBookObj, indexObj, phoneBookObj[ROOT].numOfItems);
        }
        
        //problem with the file//
        catch (err) {
            alert("problem with the format of server file");
            this.phoneBook.root = [];
            return ;
        }
    };
    
    //convert the json object into phoneBook//
    PhoneBookService.prototype.convertObjectToPhoneBook = function(phoneBookObj,indexObj, numOfChildrens) {
        while(indexObj.index < phoneBookObj.length && numOfChildrens > 0) {
            //if item is contact//
            if(phoneBookObj[indexObj.index].type == 'Contact') {
                this.phoneBook.addNewContact(phoneBookObj[indexObj.index].firstName, phoneBookObj[indexObj.index].lastName, phoneBookObj[indexObj.index].phoneNumbers);
                numOfChildrens--;
                indexObj.index++;
            }

            else {
                //create new group and add it to root//
                var newGroupName = phoneBookObj[indexObj.index].name;
                var newGroupId = this.phoneBook.getId();
                this.phoneBook.addNewGroup(newGroupName);
                var newGroupNumOfItems = phoneBookObj[indexObj.index].numOfItems;
                numOfChildrens--;
                indexObj.index++;

                //set current group to be the new group//
                this.phoneBook.currentGroup = this.phoneBook.getItemById(newGroupId);

                //net group items//
                this.convertObjectToPhoneBook(phoneBookObj, indexObj, newGroupNumOfItems);

                //return current group to be the original current group//
                if(!this.phoneBook.currentGroup.parent) {
                    this.phoneBook.currentGroup = this.phoneBook.root;
                }
                else {
                    this.phoneBook.currentGroup = this.phoneBook.currentGroup.parent;
                }
            }
        }
    };
    
    angular.module("phoneBookApp").service("PhoneBookService", PhoneBookService);
})();
