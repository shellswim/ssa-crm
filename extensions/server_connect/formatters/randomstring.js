exports.randomString = function(str) {
    var text = "";
    for (var i = 0; i < str.length; i++)
        text += str.charAt(Math.floor(Math.random() * str.length));
    return text;
}