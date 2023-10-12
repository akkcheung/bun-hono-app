import { Database } from "bun:sqlite"

const initTables = (db) => {
    const query_projects = db.query(`
        create table if not exists 
        projects ( 
            id integer primary key, 
            name text not null unique 
        )
        `)

    const query_todos = db.query(`
        create table if not exists 
        todos (  
            id integer,  
            title text not null unique,  
            project_id integer,
            done integer default 0,
            primary key(id), 
            foreign key (project_id)
                references projects(id) 
                    on delete no action 
                    on update no action 
        )
        `)

    query_projects.run()
    query_todos.run()

    console.log("init table done")
}

const initData = (db) => {
    const query_ins_projects = db.query(`
        INSERT or IGNORE INTO projects (id, name) VALUES 
            (1, 'Shopping List'),
            (2, 'Errands'); 
        `)

    const query_ins_todos = db.query(`
        INSERT or IGNORE INTO todos (id, project_id, title, done) VALUES 
            (1, 1, 'Buy milk', 1),
            (2, 1, 'Buy eggs', 0),
            (3, 2, 'Pick up laundry', 0),
            (4, 2, 'Get car washed', 0);
        `)


    query_ins_projects.run()
    query_ins_todos.run()

    console.log("init data done")
}

export {initTables, initData}
