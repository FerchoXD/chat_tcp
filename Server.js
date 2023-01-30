const net = require("net");

const server = net.createServer();

const conexiones = new Array();
const nombres = new Array();
const usuarios = new Map();

server.listen({ host: "127.0.0.1", port: 5000 }, () => {
  console.log("servidor esta escuchando en el puerto", server.address().port);
});
//Esto se ejecuta cuando un cliente se quiere conectar y el servidor lo atrapa
//la siguiente linea es una funcion flecha, cada socket es unico y el usuario siempre lo conserva
server.on("connection", (socket) => {
  //Como manda la informacion en modo buffer pus lo decodificamos para que sea entendible
  socket.setEncoding("utf-8");
  console.log("Nueva conexion" );

  //Esta funcion entra cuando detecta que un cliente envio algo a traves del socket
  socket.on("data", (data) => {
    //En la siguiente validacion, hacemos que si no tenemos ese socket pues entra al siguiente if donde checamos su nombre que si no lo tiene
    //los guardamos, si tiene el nombre mandamos a que ya existe y ya se jode
    //Que es lo que pasa, en Cliente.js, tenemos a readline.question(), apenas se ejecuta node Cliente.js, pues interpreta todo y hace que se
    //conecte al servidor y le hacemos una pregunta y que pus si no manda nada truena todo, pero lo importante es que como se conecta a la de 
    //awebo y como te dije los sockets son unicos, pues a la de awebo siempre cae verdadero en el if
    if (!conexiones.includes(socket)) {
      if (nombres.length === 0 || !nombres.includes(data)) {
        nombres.push(data);
        conexiones.push(socket);
        usuarios.set(socket, data);
      } else {
        console.log("Este nombre ya existe");
        socket.write("finalizar")
      }
      //Ya cuando ejecutaste el Cliente.js y que tu nombre sea unico pues que sucede, cada vez que detecte que el cliente haya mandado algo
      //el socket nos lo trae y vuelve a validar el if de la linea 35, pero como ahora ya tenemos su socket y nombre pues siempre caera en falso
      //y a traves de la tabla de hast obtenemos el nombre, la clave es el socket porque son unicos
      //En el caso que me hayan escrito finalizar cierro todo
    }else if(data === "finalizar"){
      console.log("Disconeccted")
    }else{
        let usuario = usuarios.get(socket);
        //data viene del cliente, usuario del diccionario y los sockets siempre son constantes, no tenemos que traerlo del array
        //ese array de conexiones, que guarda el socket nos sirve nomas para la validacion de la linea 35 y para la funcion enviar
        enviar(data, socket, usuario);
    }
  });

  //Este evento surge cuando un cliente se desconecta
  socket.on("close", () => {
    console.log("Comunicacion finalizada");
  });

  //Este evento surge cuando sucede un error
  socket.on("error", (err) => {
    console.log("Prueba")
    console.log(err.message);
  });

  
});

//Este pedazo de codigo hace que se comparta la informacion que escribe un wey a los demas weyes conectados
function enviar(data, _socket, usuario) {
  //ese for lo que hace es recorrer cada  valor de nuestro array, y en cada posicion checa si el socket que tiene ese usuario es igual a cada uno
  //que esta aguardado, es decir de los otros clientes que obviamente no son iguales y como son diferentes entra en verdadero, solo en un caso da falso y todo esto para que
  //saquemos cada socket y a traves de ese socket mandamos la info que nos dieron por ahi, y se repite todo esto hasta que recorramos todo el 
  //arreglo de conexiones, pero como obviamente tenemos nuestro socket ahi guardado cuando lleguemos al nuestro pues hace la validacion y como son
  // iguales pus no entra y asi
  //Un socket es simplemente un canal donde se envia la info, es como una direccion

  for (const socket of conexiones) {
    if (socket != _socket) {
      socket.write(usuario + " : " + data);
    }
  }
}