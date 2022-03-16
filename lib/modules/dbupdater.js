module.exports = {

    insert: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbconnector.insert: connection is required.');
        const sql = this.parseSQL(options.sql);
        const db = this.getDbConnection(connection);

        if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
        if (!sql) throw new Error('dbconnector.insert: sql is required.');
        if (!sql.table) throw new Error('dbconnector.insert: sql.table is required.');

        sql.type = 'insert';

        if (options.test) {
            return {
                options: options,
                query: sql.toString()
            };
        }

        let identity = await db.fromJSON(sql);

        if (identity) {
            if (Array.isArray(identity)) {
                identity = identity[0];
            }
    
            if (typeof identity == 'object') {
                identity = identity[Object.keys(identity)[0]];
            }
        }

        return { affected: 1, identity };
    },

    update: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbconnector.update: connection is required.');
        const sql = this.parseSQL(options.sql);
        const db = this.getDbConnection(connection);

        if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
        if (!sql) throw new Error('dbconnector.update: sql is required.');
        if (!sql.table) throw new Error('dbconnector.update: sql.table is required.');

        sql.type = 'update';

        if (options.test) {
            return {
                options: options,
                query: sql.toString()
            };
        }

        let affected = await db.fromJSON(sql);

        return { affected };
    },

    delete: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbconnector.delete: connection is required.');
        const sql = this.parseSQL(options.sql);
        const db = this.getDbConnection(connection);

        if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
        if (!sql) throw new Error('dbconnector.delete: sql is required.');
        if (!sql.table) throw new Error('dbconnector.delete: sql.table is required.');

        sql.type = 'del';

        if (options.test) {
            return {
                options: options,
                query: sql.toString()
            };
        }

        let affected = await db.fromJSON(sql);

        return { affected };
    },

    custom: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbupdater.custom: connection is required.');
        const sql = this.parseSQL(options.sql);
        const db = this.getDbConnection(connection);

        if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
        if (!sql) throw new Error('dbconnector.custom: sql is required.');
        if (typeof sql.query != 'string') throw new Error('dbupdater.custom: sql.query is required.');
        if (!Array.isArray(sql.params)) throw new Error('dbupdater.custom: sql.params is required.');

        const params = [];
        const query = sql.query.replace(/([:@][a-zA-Z_]\w*|\?)/g, param => {
            if (param == '?') {
                params.push(sql.params[params.length].value);
                return '?';
            }

            let p = sql.params.find(p => p.name == param);
            if (p) {
                params.push(p.value);
                return '?';
            }

            return param;
        });

        let results = await db.raw(query, params);

        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            results = results[0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            results = results.rows;
        }

        return results;
    },

    execute: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbupdater.execute: connection is required.');
        const query = this.parseRequired(options.query, 'string', 'dbupdater.execute: query is required.');
        const params = this.parseOptional(options.params, 'object', []);
        const db = this.getDbConnection(connection);
        
        if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);

        let results = await db.raw(query, params);

        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            results = results[0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            results = results.rows;
        }

        return results;
    },

    // bulk insert
    // values is array of objects with column(key) and value
    // batchSize is number of inserts per query (multi insert statement)
    bulkinsert: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbupdater.bulkinsert: connection is required.');
        const table = this.parseRequired(options.table, 'string', 'dbupdater.bulkinsert: table is required.');
        const values = this.parseRequired(options.values, 'object', 'dbupdater.bulkinsert: values is required.');
        const batchSize = this.parseOptional(options.batchSize, 'number', 10);
        const db = this.getDbConnection(connection);

        await db.transaction(async trtransactionx => {
            for (let i = 0; i < values.length; i += batchSize) {
                let batch = values.slice(i, i + batchSize);
                await transaction(table).insert(batch);
            }
        });
    },

    // relation insert
    // insert data into table and insert data in relation tables
    // values is object with column(key) and value to insert
    // relations is array of relation table information { table:'article_tags', idColumn: 'article_id', values: [{tagId:1},{tagId:4}] }
    relationinsert: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbupdater.relationinsert: connection is required.');
        const table = this.parseRequired(options.table, 'string', 'dbupdater.relationinsert: table is required.');
        const idColumn = this.parseRequired(options.idColumn, 'string', 'dbupdater.relationinsert: idColumn is required.')
        const values = this.parseRequired(options.values, 'object', 'dbupdater.relationinsert: values is required.');
        const relations = this.parseOptional(options.relations, 'object', []);
        const db = this.getDbConnection(connection);

        await db.transaction(async transaction => {
            const [insertedId] = await transaction(table).insert(values, idColumn);

            for (const relation of relations) {
                relation.values.forEach(value => value[relation.idColumn] = insertedId);
                await transaction(relation.table).insert(relation.values);
            }
        });
    },

    // relation update
    // update data in table and update data in relation tables
    // values is object with column(key) and value to update
    // relations is array of relation table information { table:'article_tags', idColumn: 'article_id', values: [{tagId:1},{tagId:4}] }
    relationupdate: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbupdater.relationinsert: connection is required.');
        const table = this.parseRequired(options.table, 'string', 'dbupdater.relationinsert: table is required.');
        const idColumn = this.parseRequired(options.idColumn, 'string', 'dbupdater.relationinsert: idColumn is required.')
        const idValue = this.parseRequired(options.idValue, 'string', 'dbupdater.relationinsert: idValue is required.')
        const values = this.parseRequired(options.values, 'object', 'dbupdater.relationinsert: values is required.');
        const relations = this.parseOptional(options.relations, 'object', []);
        const db = this.getDbConnection(connection);

        await db.transaction(async transaction => {
            await transaction(table).update(values).where(idColumn, idValue);

            for (const relation of relations) {
                relation.values.forEach(value => value[relation.idColumn] = idValue);
                await transaction(relation.table).where(relation.idColumn, idValue).del();
                await transaction(relation.table).insert(relation.values);
            }
        });
    },

    relationselect: async function(options) {
        const connection = this.parseRequired(options.connection, 'string', 'dbupdater.relationselect: connection is required.');
        const sql = this.parseSQL(options.sql);
        const idColumn = this.parseRequired(options.idColumn, 'string', 'dbupdater.relationselect: idColumn is required.')
        const relations = this.parseOptional(options.relations, 'object', []);
        const db = this.getDbConnection(connection);

        const results = await db.fromJSON(sql);

        for (const relation of relations) {
            // should probably have join
            const recs = await db(relation.table).whereIn(relation.idColumn, results.map(result => result[idColumn]));

            results.forEach(result => result[relation.column] = []);

            recs.forEach(rec => {
                const result = results.find(result => result[idColumn] == rec[relation.idColumn]);
                result[relation.column].push(rec);
            });
        }

        return results;
    },

};