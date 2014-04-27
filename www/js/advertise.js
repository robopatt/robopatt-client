var inmobi_conf =
{
    siteid : "4028cba6343ae5b801343b87018d001c", // your Property ID
    slot: 11,
    test: true,
    manual: true,
    //autoRefresh: 20,
    targetWindow : "_blank", // default "_top"
    //adtype: "int",
    onError : function(code)
    {
        if(code == "nfr")
        {
            alert("Error getting the ads!" + code);
        }
    }
};


var inmobi_conf_int =
{
    siteid : "4028cba6343ae5b801343b87018d001c", // your Property ID
    slot: 16,
    test: true,
    manual: true,
    //autoRefresh: 20,
    targetWindow : "_blank", // default "_top"
    adtype: "int",
    onError : function(code)
    {
        if(code == "nfr")
        {
            alert("Error getting the ads!" + code);
        }
    }
};


var ad = {
    getAd : function(conf){
        alert("getting ad");
        _inmobi.getNewAd(document.getElementById('ads'), conf);

    }
};
