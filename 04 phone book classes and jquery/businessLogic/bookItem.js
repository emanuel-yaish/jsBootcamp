/**
 * Created by emanuel on 3/17/2016.
 */
var PBApp = PBApp || {};

//book item class//
PBApp.BookItem = (function(){
    "use strict";

   //var BookItem = PBApp.BookItem;
    function BookItem(id, parent) {
        this.id = id;
        this.parent = parent
    }

    return BookItem;
})();