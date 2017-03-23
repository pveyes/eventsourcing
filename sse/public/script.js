const es = new EventSource('/events');

es.onMessage = function (event) {
  console.log(JSON.parse(event.data));
}

es.addEventListener('eventName', (event) => {
  console.log(JSON.parse(event.data));
});
