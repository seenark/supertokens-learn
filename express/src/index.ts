import { createServer } from "./server";

const app = createServer();
const port = 3333;

app.listen(port, () => {
  console.log("server running on port " + port);
});
