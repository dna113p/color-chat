export default {

  post: function(url) {
    let request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    return request;
  },

  get: function(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
      if (request.readyState === 4 && request.status === 200)
      {
        callback(request.responseText);
      }
    };
    request.open('GET', url);
    request.send();
  },


}
