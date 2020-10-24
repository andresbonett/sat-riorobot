const SerialPort = require("serialport");
var axios = require("axios");

const btn = document.getElementById("boton");
const btn_online = document.getElementById("online");
const renderNode = document.getElementById("nivel");

let port = "";
let online = false;
const Serial = "5CG9411N9S";
const URL = "https://api.riorobot.com.co/sensor/1";
// const URL = "http://localhost:3000/sensor";

btn_online.addEventListener("click", async () => {
  online = online ? false : true;
  console.log(online);
  btn_online.textContent = online ? "ON" : "OFF";
});

btn.addEventListener("click", async () => {
  renderNode.innerHTML = loader;
  if (port === "") {
    const data = await listPort();
    // list.innerHTML = data[0].manufacturer ? templateDevice(data[0]) : "Error";
    port = data.comName;
    renderLectura();
  } else {
    console.log("port is open");
  }
});

async function listPort() {
  let list = [];
  await SerialPort.list((err, ports) => {
    if (err) {
      console.log(err.message);
      return err.message;
    }

    if (ports.length === 0) {
      return "No ports discovered";
    }
    list = ports[0]; // primer puerto
    // list = [...ports]; // lista de puertos
  });
  return list;
}

// template

// function templateDevice(device) {
//   port = device.comName;
//   return /*html*/ `
//   <h1 id="status">${device.manufacturer}</h1>
//   <button onclick="renderLectura()">Status</button>
//   `;
// }

// Leer datos
function renderLectura() {
  var arduinoCOMPort = port;

  const arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudRate: 9600,
  });

  arduinoSerialPort.on("open", function () {
    console.log("Serial Port " + arduinoCOMPort + " is opened.");
  });

  arduinoSerialPort.on("data", function (data) {
    // let value = data.toString('utf8')
    let value = parseInt(data.toString("utf8"));
    if (value) {
      renderData(value);
      if (online) {
        sendData(value);
      }
    }
  });

  function renderData(value) {
    renderNode.innerHTML = value;
  }
}

function sendData(value) {
  const d = new Date();
  const Fecha =
    [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-") +
    " " +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

  const Valor = parseInt(value);
  const data = JSON.stringify({
    Fecha,
    Serial,
    Valor,
  });
  //var data = "{ Fecha: '2020-10-5 13:18:35', Serial: '5CG9411N9S', Valor: 21 }";

  var config = {
    method: "post",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

const loader = `<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
