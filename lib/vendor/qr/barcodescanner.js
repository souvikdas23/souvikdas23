/**
 * PhoneGap/Cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2010, IBM Corporation
 */
/*
;(function(){

//-------------------------------------------------------------------
var BarcodeScanner = function() {
}

//-------------------------------------------------------------------
BarcodeScanner.Encode = {
        TEXT_TYPE:     "TEXT_TYPE",
        EMAIL_TYPE:    "EMAIL_TYPE",
        PHONE_TYPE:    "PHONE_TYPE",
        SMS_TYPE:      "SMS_TYPE",
        CONTACT_TYPE:  "CONTACT_TYPE",
        LOCATION_TYPE: "LOCATION_TYPE"
}

//-------------------------------------------------------------------
BarcodeScanner.prototype.scan = function(success, fail, options) {
    function successWrapper(result) {
        console.log("in successWrapper");
        result.cancelled = (result.cancelled == 1)
        success.call(null, result)
    }

    if (!fail) { console.log("no fail function"); fail = function() {}}

    if (typeof fail != "function")  {
        console.log("BarcodeScanner.scan failure: failure parameter not a function")
        return
    }

    if (typeof success != "function") {
        fail("success callback parameter must be a function")
        return
    }
  
    if ( null == options ) 
      options = []
  
    console.log("running Cordova.exec : scan");
    return Cordova.exec(successWrapper, fail, "org.apache.cordova.barcodeScanner", "scan", options)
}

//-------------------------------------------------------------------
BarcodeScanner.prototype.encode = function(type, data, success, fail, options) {
    if (!fail) { fail = function() {}}

    if (typeof fail != "function")  {
        console.log("BarcodeScanner.scan failure: failure parameter not a function")
        return
    }

    if (typeof success != "function") {
        fail("success callback parameter must be a function")
        return
    }

    return Cordova.exec(success, fail, "org.apache.cordova.BarcodeScanner", "encode", [{type: type, data: data, options: options}])
}

//-------------------------------------------------------------------

// remove Cordova.addConstructor since it was not supported on PhoneGap 2.0
//if (!window.plugins) window.plugins = {}

if (!window.BarcodeScanner) {
    window.BarcodeScanner = new BarcodeScanner()
}

})();

*/
// Phonegap Barcode Scanner plugin
// Copyright (c) Matt Kane 2011

var BarcodeScanner = function() { 
    
}

BarcodeScanner.prototype.callbackMap = {};
BarcodeScanner.prototype.callbackIdx = 0;

// That's your lot for the moment

BarcodeScanner.Type = {
QR_CODE: "QR_CODE"
}

// Types are ignored at the moment until I implement any other than QR Code 

BarcodeScanner.prototype.scan = function(types, success, fail) {
    
    var plugin = window.plugins.barcodeScanner,
    cbMap = plugin.callbackMap,
    key = 'scan' + plugin.callbackIdx++;
    
    cbMap[key] = {
    success: function(result) {
        delete cbMap[key];
        success(result);
    },
    fail: function(result) {
        delete cbMap[key];
        fail(result);
    }
    };
    
    var cbPrefix = 'window.plugins.barcodeScanner.callbackMap.' + key;
    
    return Cordova.exec("BarcodeScanner.scan", cbPrefix + ".success", cbPrefix + ".fail", types);
};

Cordova.addConstructor(function()
                        {
                        if(!window.plugins)
                        {
                        window.plugins = {};
                        }
                        window.plugins.barcodeScanner = new BarcodeScanner();
                        });
