const cds = require ('@sap/cds')
const axios = require('axios');

//module.exports = cds.service.impl ((srv) => {
module.exports = async srv => {
   // console.log('Entered for messaging');
   const messaging = await cds.connect.to('messaging')
  //  console.log('Exit for messaging');
   console.log('Entered Normally');
    messaging.on('S4H/BO/BusinessPartner/Changed', async (msg) => {  
   // srv.on('S4H/BO/BusinessPartner/Changed', async (msg) => {    
   // console.log('=> ${JSON.stringify(msg)}');
    console.log(msg);
    console.log("*********************************");
    console.log(msg.headers.EVENT_PAYLOAD.KEY[0].BUSINESSPARTNER);
    console.log("End");
  //  const messagePayload = JSON.stringify(msg.data);   
    //console.log(messagePayload);
   // const bupaID = JSON.parse(messagePayload);    
    //console.log("ParsingStart",bupaID);
    //const ID = parseInt(bupaID['KEY'][0]['BUSINESSPARTNER']);
    const ID = parseInt(msg.headers.EVENT_PAYLOAD.KEY[0].BUSINESSPARTNER);
    console.log("BusinessPartnerNumber",ID);

// Make a request for a user with a given ID
 console.log('!!!!!!!');
 console.log('https://bpchanges-srv-grateful-eland-ef.cfapps.eu10.hana.ondemand.com/catalog/Customers/'+ID);
 console.log('!!!!!!!');
 axios.get('https://bpchanges-srv-grateful-eland-ef.cfapps.eu10.hana.ondemand.com/catalog/Customers/'+ID)
  .then(function (response) {
    // handle success
    console.log("Business Partner Found", ID);
  })
  .catch(function (error) {
    //Post New Business Partner  
    let res = axios.post('https://bpchanges-srv-grateful-eland-ef.cfapps.eu10.hana.ondemand.com/catalog/Customers', 
       {        "ID" : ID,
                "fname" : "S4 Fname",
                "lname" : "S4 lname",
                "vat" : 12344 } )
           .then((response) => {
     console.log("Business Partner Created", ID);
        }, (error) => {
        console.log(error);
    });;
  })
  .then(function () {
    // always executed to update the Profiles
    let res = axios.post('https://bpchanges-srv-grateful-eland-ef.cfapps.eu10.hana.ondemand.com/catalog/ProfilesValue', 
       {    profiles_ID : 16,
            customer_ID : ID,
            value : "Munich" } )
           .then((response) => {
     console.log("Profiles Updated");
        }, (error) => {
        console.log(error);
    });;    
  });

 });;
}