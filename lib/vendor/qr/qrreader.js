

var QRERROR= 'qrErr';
var QRSYSTEMERROR = 'qrSysErr';

// SCREENTYPE 
var SCREEN_REGISTER = 1;
var SCREEN_ADD_ACCOUNT = 2;
var screenType;
var accountTypeVar;

var accountTypeStruct = {
    "Personal" : 0,
    "Business" : 1
};

function QRstructure(accountNo, accountType, firstName, lastName, middleName,businessname)	{
    
    this.accountNo	= accountNo;
    this.accountType = accountType;
    this.firstName = firstName;
    this.lastName =	lastName;
    this.middleName = middleName;
    this.businessname = businessname;
}

function checkDevice(screen) {
    DeviceCheck.nativeFunction(                                 
                               ["Device"] ,
                               function(result) {
                               if (result.match('iPad1,1')) {
                                alertNotification(message['nocamera'], title["pn"], btnlabel["ok"]);
                               } else {
                                readqrcode(screen);
                               }},
                               function(error) {
                               }
                               );    
}


function readqrcode(screen) {

    this.screenType = screen;
    if (screen === SCREEN_REGISTER ) {
alert('run' + SCREEN_REGISTER);
        //updateAndFireTags(s,'reg-scan-qr-pg') ;
    } else {
        //updateAndFireTags(s,'add-scan-qr-pg') ;
    }
    console.log("running window.plugins.BarcodeScanner.scan()");
    if (BarcodeScanner) {
alert('true2');
        BarcodeScanner.scan(["Device"],
        function(result) {
            try {
                console.log("SCAN SUCCESS: " + result);
                parseQRResult(result);

            }catch (err) {
                console.log("SCAN EXCEPTION");
                alertNotification(message[QRERROR], title['pn'], btnlabel["ok"]);
            }
        },
        function(error) {console.log('QR SCAN ERROR');}
        );
    } else {
        console.log("could not find barcodescanner");
    }

}

function qrAlertDismissed() {
    
}

/*javascript*/
function parseQRResult(result) {
    if(result) {
        try { 
            var accountInfo;

            //Check if response has pipe in it. ....
            if (result.indexOf("%7C") != -1) {
                    accountInfo = result.split("%7C");
            } else {
                throw message[QRERROR];
            }

            if(accountInfo.length != 3) {
                throw message[QRERROR];
            }

            accountnumber = accountInfo[0];
            accountnumber =  accountnumber.replace(/%20/gi, "");

            // Third item is account type
            var accountType = accountInfo[2];
            actyparr = accountType.split("%20");

            // If Account number length is less then 10 throw QR system err || Account Type is not 0 || 1.
            if((actyparr[0] > 1) || (accountnumber.length < 10))
             throw message[QRERROR];

            // Second item is Full name. 
            var fullname = accountInfo[1];
            fullnameArr = fullname.split("%20");

            var qrstruct;
           
            if(actyparr[0] == accountTypeStruct["Personal"]) {

                if(fullnameArr.length == 2) {
                    fname = fullnameArr[0];
                    lname = fullnameArr[1];

                } else {
                    fname = fullnameArr[0];
                    lname = fullnameArr[2];            
                }
                
                qrstruct = new QRstructure(accountnumber, accountTypeStruct["Personal"]+1, fname, lname, "");	
                
                if(screenType === SCREEN_REGISTER) {
                // set selection
                    var myswitch = $("select#regAccountType");
                    if(myswitch[0].selectedIndex != qrstruct.accountType) {
                        myswitch[0].selectedIndex = qrstruct.accountType;
                        myswitch.selectmenu("refresh");  
                    }

                    //  This is a hack to clear the page .....
                    $("#registrationForm input[name=regTxtFirstName]").val(""); 
                    $("#registrationForm input[name=regTxtLastName]").val(""); 
            
                    // Now Change the Form fields Coz This is a Business account ....
                    toggleFields();



                    // First Name Filling 
                    $("#registrationForm input[name=regTxtFirstName]").val(qrstruct.firstName); 
                    // Filling last name
                    $("#registrationForm input[name=regTxtLastName]").val(qrstruct.lastName); 

                }

            } else if(actyparr[0] == accountTypeStruct["Business"]){
                
                var businessname = fullname.replace(/%20/gi," ");
                qrstruct = new QRstructure(accountnumber, accountTypeStruct["Business"]+1, "","","",businessname);
                
                if(screenType === SCREEN_REGISTER) {
                    // set selection
                    var myswitch = $("select#regAccountType");     
                    if(myswitch[0].selectedIndex !=  qrstruct.accountType) {
                        myswitch[0].selectedIndex = qrstruct.accountType;
                        myswitch.selectmenu("refresh");
                    }

                    $("#registrationForm input[name=regTxtBusinessName]").val(""); 
                    // Change the Form Fields for Business Account.
                    toggleFields();

                    // Filling the business name 
                    $("#registrationForm input[name=regTxtBusinessName]").val(qrstruct.businessname); 
                }
        }
            
       // Filling account No
       if(screenType === SCREEN_REGISTER) {     
           $("#registrationForm input[name=regVehicleAccountNo]").val(""); 
           $("#registrationForm input[name=regVehicleAccountNo]").val(qrstruct.accountNo);    
           updateAndFireLinks(s,'reg-scan-qr-link') ;
       } else if (screenType === SCREEN_ADD_ACCOUNT) {
           
           $("#vehAcctNo").val("");    
           $("#vehAcctNo").val(qrstruct.accountNo);
           $("#vehAcctNo").focus();
           accountTypeVar = qrstruct.accountType;
           
           if(qrstruct.accountType === 2) {
               logger('qrstruct.accountType'+qrstruct.accountType);
               $("#vehicleForm input[name=vehSsn]").val(ENTER_TAXID);
           } else if(qrstruct.accountType === 1) {
               logger('qrstruct.accountType'+qrstruct.accountType);
               $("#vehicleForm input[name=vehSsn]").val("");
               document.getElementById('vehSsn').type = 'text';//number';
               $("#vehicleForm input[name=vehSsn]").val(ENTER_SSN); 
           }
           updateAndFireLinks(s,'reg-scan-qr-link') ;
       }
            // Fire omniture tag
            //updateAndFireLinks(s,'scan-qr-link') ;
    }catch(err) {
            // If there is any issue in reading QRCode it will be caught here ...    
            throw err;
        }

    } else {
       alertNotification(message[QRSYSTEMERROR], title["pn"], btnlabel["ok"]);  
    }
}

function fillQRField(screen) {
        
}
