import { sql } from "./mysql.js";
export var Category_data = [];
export var users = {};
async function start() {
  let Category_data_ = await sql(`select * from Category`);
  Category_data_.forEach((element) => {
    Category_data.push(element);
  });
}
start();
