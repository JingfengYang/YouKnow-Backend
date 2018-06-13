var JPush = require("jpush-async")
var database = require('../database')

/*var client = JPush.buildClient('your appKey', 'your masterSecret')*/
var client = JPush.buildClient('5013c7344b787a461276da92', 'bd4aef85608b5791c8574359');

var newestMsg=-1;

function pushCallBack(code,data,msg){
    if(code==-3){
        console.log("USRerror");
    }
    else if (data.length==0){
        console.log("No Subscribe Usr");
    }
    else{
        newestMsg=data[0].MsgID;
        data.forEach(elem => {
    
            client.push().setPlatform(null,'ios')
                  .setAudience(null,JPush.alias(elem.UserID))
                  .setNotification('New Message', null, JPush.android(msg.Brief, msg.SrcID, 1,msg))
                  .setOptions(null, 60)
                  .send()
                  .then(function(result) {
                      console.log(result)
                  }).catch(function(err) {
                      console.log(err)
                  });
        });   
    }
}

function callback(code, data) {
    if(code==-3){
        console.log("error");
    }
    else if (data.length==0){
        console.log("No New Data");
    }
    else{
        newestMsg=data[0].MsgID;
        data.forEach(elem => {
            database.get_src_usr(elem.SrcID,pushCallBack,elem);
        });   

    }

}

function  checkNewMsg(Interval){
    database.get_new_msg(newestMsg,callback);
}
var myInterval=setInterval(checkNewMsg,60 * 60 * 1000);
/*function  stopInterval(){
    clearTimeout(myInterval);
 //myInterval.unref();
}
setTimeout(stopInterval,5000);*/

/*module.exports = function (userid, data){

	//easy push
	client.push().setPlatform(null,'ios')
    	.setAudience(null,JPush.alias(userid))
    	.setNotification('New Message', null, JPush.android(data[0].brief, data[0].src, 1,data))
    	.setOptions(null, 60)
    	.send()
    	.then(function(result) {
        	console.log(result)
    	}).catch(function(err) {
        	console.log(err)
   		});
}*/

