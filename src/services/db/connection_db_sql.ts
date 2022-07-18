import { Connection, createConnection } from "mariadb";

export default class ConnectDB_SQL {
  private static empty = "";
  private static user: string = process.env.DB_USER_SQL || this.empty;
  private static host: string = process.env.DB_HOST_SQL || this.empty;
  private static password: string = process.env.DB_PASS_SQL || this.empty;
  private static database: string = process.env.DB_SQL_HOGARAPP || this.empty;
  private static port: number  = process.env.DB_SQL_PORT
    ? parseInt(process.env.DB_SQL_PORT):3308;

  public async connect(): Promise<Connection> {    
    const config = ConnectDB_SQL;
    const { user, host, password, database, port } = config;
    return createConnection({ user,host, password,database});
  }
}
