import { Hono } from 'hono'
import { Database } from "bun:sqlite"

import { initTables, initData } from "./db.js"
import { registerHelpers, registerPartials } from "./hbs.js"
import { viewRoot, viewApp, viewNewTodo, viewTodoList, viewAppAfterProjectSelect, viewAppAfterTodoStausChange, viewAppAfterProjectNew } from "./routes.js"

const app = new Hono()
const db = new Database(":memory:")

initTables(db)
initData(db)

registerHelpers()
registerPartials()

app.get('/', (c) => viewRoot(c))

app.get('/app', async (c) => viewApp(c, db))

app.post('/projects/:projectId/todos/new', async (c) => viewNewTodo(c, db))

app.get('/projects/:projectId/todos', async (c) => viewTodoList(c, db))

app.get('/projects/:projectId', async (c) => viewAppAfterProjectSelect(c, db))

app.put('/projects/:projectId/todos/:todoId/state', async (c) => viewAppAfterTodoStausChange(c, db))

app.post('/projects/new', async (c) => viewAppAfterProjectNew(c, db))

export default app
