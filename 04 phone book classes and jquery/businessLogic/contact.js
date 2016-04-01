/**
 * Created by emanuel on 3/15/2016.
 */
var PBApp = PBApp || {};
//book item class//
PBApp.Contact = (function() {
    "use strict";

    //contact class//
    function Contact(id, firstName, lastName, phoneNumbers, parent) {
        //parent constructor//
        PBApp.BookItem.call(this, id, parent);
        //init Contact//
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumbers = phoneNumbers;
    }

    //inheritance from bookItem//
    Contact.prototype = Object.create(PBApp.BookItem.prototype);

    return Contact;
})();
