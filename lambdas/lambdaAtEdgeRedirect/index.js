'use strict';

exports.handler = async (event, context, callback) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    let request = event.Records[0].cf.request;
    
    request.uri = "/index.html";
    
    return callback(null, request);
}; 
