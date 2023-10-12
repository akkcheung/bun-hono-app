import { schema } from "./validation.js"
import { renderTemplate } from "./hbs.js"

const hbs = require('handlebars')

const viewRoot = (c) =>
    c.text('Hello Todo App !')

async function viewApp (c, db){

    let query = db.query("select id, name from projects order by rowid limit 1")
    const project = query.get()
    console.log(project)

    query = db.query("select id, title, done from todos where project_id = ?1 order by rowid ")
    const todos = query.all(project.id)
    console.log(todos)

    query = db.query("select id, name from projects order by rowid")
    const projects = query.all()
    console.log(projects)

    const path = "./src/views/index.htm"
    const data = {
        project : project,
        todos : todos,
        projects : projects
    }

    console.log(data)
    
    const str = await renderTemplate(path, data)
    return c.html(str)
}

async function viewNewTodo (c, db){
    const { projectId } = c.req.param()
    const formData = await c.req.parseBody()

    //console.log(formData)

    const {error, value} = schema.validate({title: formData.title})

    if (typeof error == 'undefined') {
        const query = db.query("insert into todos (title, project_id) values (?1, ?2)")
        const result = query.run(formData.title, projectId)
    }

    const path = "./src/views/partials/NewTodoForm.htm"
    const data = {
        project : {
            id: projectId
        },
        error : error
    }

    c.res.headers.set("HX-Trigger", "newTodo")

    const str = await renderTemplate(path, data)
    return c.html(str)
}

async function viewTodoList (c, db){
    const { projectId } = c.req.param()

    const query = db.query("select id, title, done from todos where project_id = ?1 order by rowid ")
    const todos = query.all(projectId)

    const data = {
        project : {
            id: Number(projectId)
        },
        todos : todos
    }

    const path = "./src/views/partials/TodoListForProject.htm"
    const str = await renderTemplate(path, data)
    return c.html(str)
}

async function viewAppAfterProjectSelect (c, db){
    const { projectId } = c.req.param()

    let query = db.query("select id, title, done from todos where project_id = ?1 order by rowid ")
    const todos = query.all(projectId)
    console.log(todos)

    query = db.query("select id, name from projects order by rowid")
    const projects = query.all()
    console.log(projects)

    const project = {
        id: Number(projectId)
    }

    const data = {
        project : project,
        todos : todos,
        projects : projects
    }

    console.log(data)

    const path = "./src/views/index.htm"
    const str = await renderTemplate(path, data)
    return c.html(str)
}

async function viewAppAfterTodoStausChange (c, db){

    const { projectId, todoId } = c.req.param()

    let query = db.query("update todos set done = (case when done = 0 then 1 else 0 end)where id= $1") 

    const result = query.run(todoId)

    query = db.query("select id, title, done from todos where id= ?1")
    const todo = query.get(todoId)

    const data = {
        projectId : Number(projectId),
        id : Number(todoId),
        title : todo.title,
        done: todo.done
    }
    console.log(data)

    const path = "./src/views/partials/TodoListItem.htm"

    const str = await renderTemplate(path, data)
    return c.html(str)
}

async function viewAppAfterProjectNew (c, db){
    const name = c.req.header('HX-Prompt')
    console.log(name)

    let query = db.query("insert into projects (name) values (?1)")
    const result = query.run(name)
    
    query = db.query("select id, name from projects order by rowid desc limit 1")
    const project = query.get()

    query = db.query("select id, name from projects order by rowid")
    const projects = query.all()

    query = db.query("select id, title, done from todos where project_id = ?1 order by rowid ")
    const todos = query.all(project.id)
    console.log(todos)

    const data = {
        project : project,
        todos : todos,
        projects : projects
    }

    const path = "./src/views/index.htm"

    console.log(data)

    const str = await renderTemplate(path, data)
    return c.html(str)
}

export { viewRoot, viewApp, viewNewTodo, viewTodoList, viewAppAfterProjectSelect, viewAppAfterTodoStausChange, viewAppAfterProjectNew }
