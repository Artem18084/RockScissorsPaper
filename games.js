const net = require("net");
const chalk = require("chalk");
const players = [];
const memory = [];

const server = net.createServer(function (socket) {
  socket.write(chalk.Chalk.red("Welcome to my own games\r\n"));
  memory.forEach((user) => {
    `${user.name}: ${user.choose}\n`;
  });

  socket.write(`let's meet,and do your choose: `);
  let port = socket.remotePort;
  console.log("player IP Port: ", socket.remoteAddress);
  console.log("player conected. Port: ", port);
  let name = null;

  players.push(socket);

  socket.on("data", (choose) => {
    choose = choose.toString().trim();
    if (name === null) {
      name = choose;
    } else {
      memory.push({ name, choose });
      players.forEach((player) => {
        if (player !== socket) {
          player.write("your opponent has done a choose ");
          console.log(memory);
        }
      });

      if (memory.length === 2) {
        let combinations = [
          "piper vs rock",
          "rock vs scissors",
          "scissors vs piper",
        ];

        if (
          `${memory[0].choose} vs ${memory[1].choose}` == combinations[0] ||
          `${memory[0].choose} vs ${memory[1].choose}` == combinations[1] ||
          `${memory[0].choose} vs ${memory[1].choose}` == combinations[2]
        ) {
          socket.write(
            `Congratulation ${memory[0].name} you are the campion!!!\nlet\'s restart game`
          );
        } else {
          socket.write(
            `Congratulation ${memory[1].name} you are the campion!!!\nlet\'s restart game`
          );
        }
      }
    }
  });
  socket.on("close", () => {
    let playerIndex = players.indexOf(socket);
    players.splice(playerIndex, 1);
    console.log("Closed", port);
  });

  socket.pipe(process.stdout);
});

server.listen(1337, "127.0.0.1", () => {
  console.log("Listening on", server.address());
});
