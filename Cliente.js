const { Socket } = require("net");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Aqui le modificaras para lo de que se conecten otras laptops
const options = {
  port: 5000,
  host: "127.0.0.1",
};

//Lo declaramos para poder usar todos sus metodos
const client = new Socket();
//Decodificamos toda la informacion que vayamos a enviar y asi
client.setEncoding("utf-8");

//Hacemos la conexion al server
client.connect(options);

//Esta funcion siempre se ejecutwa
function iniciar(){
  //Este evento entra cuando se pudo hacer la conexion
    client.on("connect", () => {
        console.log("Conexion satisfactoria!");
        console.log("Escribe Finalizar para salir del servidor");
      
        //Esto es lo que te decia, apenas se conecte se hace la pregunta para que entre al evento data del Server.js en la linea 29
        //Ojo readline es asincrono
        readline.question("Elige tu nombre de usuario: ", (username) => {
          client.write(username);
          console.log("-------------------------------------------")
          console.log("Username: " + username)
          console.log("-------------------------------------------")
        });
      
        //Este evento se ejecuta cuando escribes por la terminal y le das enter y cierra el canal del cliente si escribes Finalizar, osea el socket
        readline.on("line", (line) => {
          client.write(line);
          if (line == "Finalizar") {

            client.end();
          }
        });
      });
  
      //Cada vez que el servidor nos responde entra este evento
      client.on("data", (data) => {
        if(data === "Finalizar"){
          console.log("Algo malo sucedio porque se te ha desconectado del servidor")
            client.end();
        }else{
            console.log(data)
        }
      });
      
      //Cuando detecta un error imprime el error
      client.on("error", (err) => {
        console.log(err.message);
        process.exit(0);
      });
}

iniciar()

//Rehice este codigo para que se te sea mas sencillo entenderle, tiene unas cuantas fallas y cosas que no se usan, pocas pero es funcional
//Ahi me dices pe we