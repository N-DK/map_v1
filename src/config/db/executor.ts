import { Pool, QueryResult } from 'pg';
import connectToPostgres from '../db/connect';
import { OptionsType, QueryConditions } from '../../types';
import axios from 'axios';
import { URL_API } from '../../constant';
import convertToHStore from '../../modules/convertToHStore';

let pool: Pool;

const initializeDB = async () => {
    pool = await connectToPostgres();
};

const query = async (
    tableName: string,
    queryObject: QueryConditions,
    options: OptionsType = {},
    callback: (err: Error | null, results?: QueryResult<any>[]) => void,
) => {
    try {
        const keys = Object.keys(queryObject);
        const values = Object.values(queryObject);

        const whereClause = keys.length
            ? `WHERE ${keys
                  .map((key, i) => `${key} = $${i + 1}`)
                  .join(' AND ')}`
            : '';
        const columns = options.columns ? options.columns.join(', ') : '*';
        const orderBy = options.orderBy ? `ORDER BY ${options.orderBy}` : '';
        const limit = options.limit ? `LIMIT ${options.limit}` : '';
        const offset = options.offset ? `OFFSET ${options.offset}` : '';
        const text = `SELECT ${columns} FROM ${tableName} ${whereClause} ${orderBy} ${limit} ${offset}`;
        const res = await pool.query(text, values);
        callback(null, res.rows);
    } catch (err: any) {
        console.log(err);
        callback(err);
    }
};

const update = async (
    place_id: number,
    data: { [key: string]: any },
    callback: (err: Error | null, results?: QueryResult<any>[]) => void,
) => {
    try {
        if (data.name) {
            data['name'] = convertToHStore(data['name']);
        }
        const keys = Object.keys(data).filter(
            (key: string) => key !== 'lat' && key !== 'lon',
        );
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = keys.map((key) => data[key]);

        const queryText = `UPDATE placex SET ${setClause} WHERE place_id = ${place_id} RETURNING *`;
        const res = await pool.query(queryText, values);
        callback(null, res.rows);
    } catch (err: any) {
        console.error('Error:', err);
        callback(err);
    }
};

const insert = async (
    tableName: string,
    data: { [key: string]: any },
    callback: (err: Error | null, results?: QueryResult<any>[]) => void,
) => {
    try {
        const keys = Object.keys(data).filter((key) => key !== 'name');
        const values = keys.map((key) =>
            parseInt(data[key].toFixed(7).toString().replace('.', '')),
        );
        // insert data to planet_osm_nodes table
        const queryText = `INSERT INTO ${tableName} (${keys.join(
            ', ',
        )}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
        // insert data to placex table

        const queryFindClassAndType = `
        WITH point AS (SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom)
        SELECT p.class, p.type, p.place_id, ST_Distance(p.centroid, point.geom) AS distance, name
        FROM placex p, point WHERE name IS NOT NULL
        ORDER BY p.centroid <-> point.geom 
        LIMIT 1;`;

        const resQueryFindClassAndType = await pool.query(
            queryFindClassAndType,
            [data.lon, data.lat],
        );

        const queryTextPlacex = `INSERT INTO placex (osm_type, osm_id, class, type, name, admin_level, indexed_status, geometry)
        VALUES ($1, $2, $3, $4, $5, 15, 0, ST_SetSRID(ST_GeomFromText('POINT(${data.lon} ${data.lat})'), 4326)) RETURNING *;`;
        const res = await pool.query(queryText, values);
        const resPlacex = await pool.query(queryTextPlacex, [
            'N',
            res.rows[0].id,
            resQueryFindClassAndType.rows[0].class,
            resQueryFindClassAndType.rows[0].type,
            convertToHStore(data['name']),
        ]);
        const result = await pool.query(
            `UPDATE placex SET indexed_status = 0 WHERE place_id = ${resPlacex.rows[0].place_id}  RETURNING *;`,
        );
        callback(null, result.rows);
    } catch (err: any) {
        console.error('Error:', err);
        callback(err);
    }
};

const save = async (
    tableName: string,
    data: { [key: string]: any },
    callback: (err: Error | null, results?: QueryResult<any>[]) => void,
) => {
    const placeResult = await axios.get(
        `${URL_API}/reverse?lat=${data.lat}&lon=${data.lon}&format=json`,
    );
    if (placeResult?.data?.place_id && placeResult?.data?.osm_type === 'node') {
        await update(placeResult.data.place_id, data, callback);
    } else {
        await insert(tableName, data, callback);
    }
};

export { initializeDB, query, insert, save };
