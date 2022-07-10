import { connect } from "mongoose";

export default class ConnectDB_MONGO {
  private static connetion_credential: string | undefined =
    process.env.DB_USER_SQL;
  public static async connect() {
    const config = this;
    if (!config.connetion_credential) throw new Error();
    return connect(config.connetion_credential);
  }
}
