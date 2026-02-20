import net from 'node:net';
import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not set');
}

type SocketFactoryOptions = {
  host: string[];
  port: number[];
};

type PostgresSocket = net.Socket & {
  host?: string;
  port?: number;
};

const globalForSql = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

export const sql =
  globalForSql.sql ??
  postgres(connectionString, {
    ssl: 'require',
    connect_timeout: 15,
    socket: ({ host, port }: SocketFactoryOptions) =>
      new Promise((resolve, reject) => {
        const hostname = host[0];
        const socket = net.createConnection(
          {
            host: hostname,
            port: port[0],
            family: 4,
          },
          () => {
            const trackedSocket = socket as PostgresSocket;
            trackedSocket.host = hostname;
            trackedSocket.port = port[0];
            resolve(socket);
          },
        );

        socket.on('error', reject);
      }),
  } as any);

if (process.env.NODE_ENV !== 'production') {
  globalForSql.sql = sql;
}
