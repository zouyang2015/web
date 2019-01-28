/* (C) 2018-03-26  Qi Yong */

if (typeof local_port === 'undefined') {
  var local_port = ''
}
var wsUri = 'ws://localhost:' + local_port

window.onload = function () {
  console.log('[client] starting WebSocket')
  var socket = new WebSocket(wsUri)

  socket.onclose = function () {
    console.error('web channel closed')
  }

  socket.onerror = function (error) {
    console.error('web channel error: ' + error)
  }

  socket.onmessage = function (event) {
    console.log('message from server:')
    console.log(event.data)
  }

  socket.onopen = function () {
    new QWebChannel(socket, function (channel) {
      channel.objects.core.service_ready.connect(function () {
        window.core = channel.objects.core
        var event = new Event('service_ready')
        window.dispatchEvent(event)
      })

      channel.objects.core.doc_changed.connect(function (value) {
        console.log('doc_changed')
        // console.log(window.core.doc.status);
        // console.log(value)
      })
      channel.objects.core.client_loaded()
      console.log('[client] initialized')
    })
  }
}
