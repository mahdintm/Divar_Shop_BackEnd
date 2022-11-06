import { createPool } from "mysql2";
import dotenv from "dotenv";
dotenv.config();
// create the connection to database
const pool_Main = createPool({
  host: process.env.Host_MYSQL,
  user: process.env.Username_MYSQL,
  password: process.env.Password_MYSQL,
  database: process.env.Database_MYSQL_Main,
  port: process.env.Port_MYSQL,
});
export async function sql(sql_command) {
  try {
    const [rows_Main, fields_Main] = await pool_Main.promise().query(sql_command);
    if (rows_Main.length == 1) {
      return rows_Main[0];
    } else {
      return rows_Main;
    }
  } catch (error) {
    console.log(error);
  }
}

// // create the connection to database
// const pool_Log = createPool({
//   host: process.env.Host_MYSQL_Log,
//   user: process.env.Username_MYSQL_Log,
//   password: process.env.Password_MYSQL_Log,
//   database: process.env.Database_MYSQL_Log,
//   port: process.env.Port_MYSQL_Log,
// });

// pool_Log.on("connected", () => {
//   console.log("Connection");
// });
// export async function sql_log(sql_command) {
//   try {
//     const [rows_Main, fields_Main] = await pool_Log.promise().query(sql_command);
//     if (rows_Main.length == 1) {
//       return rows_Main[0];
//     } else {
//       return rows_Main;
//     }
//   } catch (error) {
//     logger.addlog.server({
//       locatin: "Server->db-sql_log()",
//       message: error,
//     });
//   }
// }
