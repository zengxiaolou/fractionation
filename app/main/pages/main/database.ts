import { join } from 'node:path';
import  sqlite3  from 'sqlite3';
import { app } from 'electron';
import { Data, DataQuery } from '@/pages/main/types';

class DatabaseManager {
  private db: sqlite3.Database | undefined = undefined;

  constructor() {
    this.createDatabase();
  }

  private createDatabase() {
    const databasePath = join(app.getPath('userData'), 'fraction.db');
    this.db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    this.db.run(
      `CREATE TABLE IF NOT EXISTS fraction (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
      name TEXT,
      level TEXT,
      created_at DATETIME
      )`,
      (error: Error| null) => {
        if (error) {
          console.error(error);
        }
      }
    )
  }

  public save(data: Data): Promise<Data| Error>  {
    const {customer_id, name, level} = data;
    const now = new Date();
    const query = `INSERT INTO fraction (customer_id, name, level, created_at) VALUES (?,?,?)`
    return new Promise((resolve, reject) => {
      this.db?.run(query, [customer_id, name, level, now], (error: Error| null) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      })
    })
  }

  public saveAll(dataArray: Data[]): Promise<Data[] | Error> {
    const now = new Date();
    let placeholders = dataArray.map(() => '(?,?,?,?)').join(',');
    let flatData = dataArray.flatMap(data => [data.customer_id, data.name, data.level, now]);
    const query = `INSERT INTO fraction (customer_id, name, level, created_at) VALUES ${placeholders}`;


    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database connection does not exist.'));
        return;
      }

      this.db.run(query, flatData, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve(dataArray);
        }
      });
    });
  }

  public getRowsByPage(parameters: DataQuery): Promise<{ data: Data[]; total: number }> {
    console.log(parameters);
    let query = 'SELECT * FROM fraction';
    let countQuery = 'SELECT COUNT(*) AS total FROM fraction';
    const baseQueryParameters: (string | number | boolean | Date)[] = [];
    const queryParameters: (string | number | boolean | Date)[] = [];
    const conditions = [];

    if (parameters?.name && parameters.name !== '') {
      console.log('name');
      conditions.push('name LIKE ?');
      queryParameters.push('%' + parameters.name + '%');
    }
    if (parameters?.level) {
      conditions.push('level =?');
      queryParameters.push(parameters.level);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
      Array.prototype.push.apply(baseQueryParameters, queryParameters);
    }

    if (parameters?.page_size && parameters?.page_size > 0 && parameters?.page_number) {
      const offset = parameters.page_size * (parameters.page_number - 1);
      query += ' ORDER BY customer_id ASC LIMIT ? OFFSET ?';
      queryParameters.push(parameters.page_size, offset);
    }

    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        this.db?.all(countQuery, baseQueryParameters, (error, countResult: [{ total: number }]) => {
          if (error) {
            reject(error);
            return;
          }
          const totalCount = countResult[0].total;

          this.db?.all(query, queryParameters, (error, rows: Data[]) => {
            if (error) {
              reject(error);
            } else {
              resolve({ data: rows, total: totalCount });
            }
          });
        });
      });
    });
  }
}


export default DatabaseManager;
