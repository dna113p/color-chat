export default function(message) {

  let request = new XMLHttpRequest();
  request.open('POST', '/api/message', true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  request.send(JSON.stringify(message));

}
