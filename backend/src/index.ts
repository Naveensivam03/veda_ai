import { connectDB } from "./service/db";

connectDB().then(() => {
  console.log("App started — DB connected");
}).catch(err => {
  console.error(err);
});
