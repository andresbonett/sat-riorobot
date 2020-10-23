const SerialPort = require('serialport')

const btn = document.getElementById('scan')
const list = document.getElementById('listPort')
const renderNode = document.getElementById('ports')

let port = ''

btn.addEventListener('click', async () => {
  const data = await listPort()
  list.innerHTML = data[0].manufacturer ? templateDevice(data[0]) : 'Error'
})

async function listPort() {
  let list = []
  await SerialPort.list((err, ports) => {
    console.log(ports[0])
    if (err) {
      console.log(err.message)
      return err.message
    }

    if (ports.length === 0) {
      return 'No ports discovered'
    }
    list = [...ports]
  })
  return list
}

// template

function templateDevice(device) {
  port = device.comName
  return /*html*/ `
  <h1 id="status">${device.manufacturer}</h1>
  <button onclick="renderLectura()">Status</button>
  `
}

// Leer datos
function renderLectura() {
  var arduinoCOMPort = port

  const arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudRate: 9600,
  })

  arduinoSerialPort.on('open', function () {
    console.log('Serial Port ' + arduinoCOMPort + ' is opened.')
  })

  arduinoSerialPort.on('data', function (data) {
    // let value = data.toString('utf8')
    let value = parseInt(data.toString('utf8'))
    if (value) {
      // sendData(value)
      renderData(value)
    }
  })

  function renderData(value) {
    console.log(`Distancia: ${value}cm`)
    renderNode.innerHTML = `Distancia: ${value}cm`
  }
}
