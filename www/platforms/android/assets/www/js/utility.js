
function levelInfo(val)  {
    this.value = val
    this.opSuccess = false;
}

function userScore(levelId,totalAttemp,score){
    this.levelId = levelId;
    this.totalAttemp = totalAttemp;
    this.score = score;
    this.opSuccess = false;    // to keep track if operation applied is successful for example in case of get score for given level
}

function databseObj() {
    this.dbObj = null
}


var utility = {

    checkConnection : function (){
        var networkState = navigator.connection.type;
        if(networkState == Connection.NONE){
            return false;
        }
        return true;
    },


    initializeLocalDatabase : function (db,callback){
        alert("opening db ");
        db.dbObj = window.openDatabase("robopattDB", "1.0", "robopatt DB", 200000);
        alert("after opening db "+db.dbObj + " -- "+callback);
        db.dbObj.transaction(utility.processDatabaseForAppInitialization, utility.errorTx, function(){utility.successTxInitializationLocalDB(db,callback)});

        //return db;
    },

    successTxInitializationLocalDB : function(db,callback){
        alert("calling cutom call back "+callback);
        callback(db);

    },

    processDatabaseForAppInitialization : function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS lastSolved (level)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS userInfo(uid)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS userScore (level,totalAttemp,score)');
        alert("starting select query");
        tx.executeSql('SELECT * FROM lastSolved', [], utility.initializationLastSolvedQuerySuccess, utility.initializationLastSolvedQueryError);
        alert("after select query");
    },


    initializationLastSolvedQuerySuccess : function(tx,resultSet){
        alert("initialization last solved");
        if(resultSet.rows.length == 0){
            alert("inserting 0 to db");
            tx.executeSql('INSERT INTO lastSolved (level) VALUES (0)');
            alert("inserted");
        }

    },

    initializationLastSolvedQueryError : function(){
        alert("initializationLastSolvedQueryError");
    },


    getLastSolvedLevel : function(db,levelInfoObj,callback){
        alert("transaction for get last level");
        db.dbObj.transaction( function(tx) { utility.getLastSolvedLevelQuery(tx,levelInfoObj) }, utility.errorTx, function () {utility.successTxGetLastSolvedLevel(db,levelInfoObj,callback)});
    },

    successTxGetLastSolvedLevel : function(db,levelInfoObj,callback){
        callback(db,levelInfoObj);
    },


    getLastSolvedLevelQuery : function (tx,levelInfoObj){
        alert("query for get last level");
        tx.executeSql('SELECT * FROM lastSolved',[], function (tx,resultSet) { utility.successGetLastLevelQuery (tx,resultSet,levelInfoObj) },utility.errorGetLastLevelQuery);

    },


    successGetLastLevelQuery : function(tx,resultSet,levelInfoObj){
        alert(" last solved query success "+ resultSet.rows.length);
        if(resultSet.rows.length != 0){
            levelInfoObj.value =  resultSet.rows.item(0).level;
            levelInfoObj.opSuccess = true;
            alert(" level obj "+ levelInfoObj.value);
        }
    },


    errorGetLastLevelQuery : function(){
      alert("errorGetLastLevelQuery");
    },


    incrementLastSolvedLevel : function(db,levelInfoObj,callback){
        db.dbObj.transaction(function(tx) { utility.incrementLastSolvedLevelQuery(tx,levelInfoObj) }, utility.errorTx, function() {utility.successTxincrementLastSolvedLevel(db,levelInfoObj,callback)})
    },


    successTxincrementLastSolvedLevel : function(db,levelInfoObj,callback){
        alert("callback for incrementlevel");
        levelInfoObj.value=parseInt(levelInfoObj.value)+1;
        levelInfoObj.opSuccess=true;
        callback(db,levelInfoObj);
    },

    incrementLastSolvedLevelQuery : function(tx,levelInfoObj){
        alert(" before incrementing " + levelInfoObj.value);
        var newLevel = parseInt(levelInfoObj.value)+1;
        tx.executeSql('UPDATE lastSolved SET level=' + newLevel + ' WHERE level='+levelInfoObj.value,[],utility.successIncrementLastSolvedQuery, utility.errorIncrementLastSolvedQuery);

    },


    successIncrementLastSolvedQuery : function(){
        alert("update last solved query success ")
    },

    errorIncrementLastSolvedQuery : function(){
        alert("update last solved query failure ");
    },

    successTx : function(){
        alert("success transaction ");
    },

    errorTx : function(){
        alert("error transaction ");
    },


    // update logic for score
    updateLocalScoreTable : function(db,userscoreObj){
        db.dbObj.transaction(function(tx) {utility.updateLocalUserScoreQuery(tx,userscoreObj)}, utility.errorTx, utility.successTx);
    },


    updateLocalUserScoreQuery : function(tx, userscoreObj){
        alert("call for user score update");
        tx.executeSql('SELECT * FROM userScore WHERE level='+userscoreObj.levelId,[],function(tx,resultSet) {utility.selectSuccessUpdateLocalScore (tx,resultSet,userscoreObj)}, utility.selectErrorUpdateLocalScore);
    },


    selectSuccessUpdateLocalScore : function(tx,resultSet,userscoreObj){
        if(resultSet.rows.length ==0){
            // insert as new entry
            tx.executeSql('INSERT INTO userScore VALUES (?,?,?)',[userscoreObj.levelId,userscoreObj.totalAttemp,userscoreObj.score]);
        }
        else{
            // update score
            tx.executeSql('UPDATE userScore SET totalAttemp='+userscoreObj.totalAttemp+ ', score='+userscoreObj.score+ ' WHERE level='+userscoreObj.levelId);
        }
    },

    selectErrorUpdateLocalScore : function (){
        alert("selectErrorUpdateLocalScore");
    },

    // updates the score for level present in userscoreObj
    getUserScoreForGivenLevel : function(db,userscoreObj){
        db.dbObj.transaction(function(tx) { utility.getUserScoreForGivenLevelQuery(tx,userscoreObj) },errorTx,successTx)
    },


    getUserScoreForGivenLevelQuery : function(tx,userscoreObj){
        tx.executeSql('SELECT * FROM userScore WHERE level='+userscoreObj.levelId,[], function(tx,resultSet){ utility.getUserScoreForGivenLevelQuerySuccess(tx,resultSet,userscoreObj) }, utility.getUserScoreForGivenLevelQueryError);
    },


    getUserScoreForGivenLevelQuerySuccess : function(tx,resultSet,userscoreObj){
        if(resultSet.rows.length !=0){
            userscoreObj.totalAttemp = resultSet.rows.item(0).totalAttemp;
            userscoreObj.score = resultSet.rows.item(0).score;
            userscoreObj.isUpdated =true;
        }

    },

    getUserScoreForGivenLevelQueryError : function(){
        alert("getUserScoreForGivenLevelQueryError");
    }

};