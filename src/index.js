import { Hono } from 'hono'
import { html } from 'hono/html'
import { Database } from "bun:sqlite"

const app = new Hono()

const handlebars = require('handlebars')

const data = {"name": "Alan Cheung"}

const db = new Database(":memory:")

let source  

async function getFile(file){
    const text  = await file.text()
    .then( data => {console.log(data); source = data})
    .catch( err => {console.log(err)})

}

app.get('/', (c) => c.text('Hello Hono !'))

app.get('/hbs-demo', (c) => {

    let str = "<p>Hello, {{name}}</p>"
    const template = handlebars.compile(str)
    return c.html(template(data))

})

app.get('/hbs-template-demo', async (c) => {

    const path = "./index.hbs"
    const file = Bun.file(path)

    await getFile(file)
    // console.log(source)

    const template = handlebars.compile(source)
    return c.html(template(data))
})

app.get('/hbs-template-db-demo', async (c) => {

    const path = "./index.hbs"
    const file = Bun.file(path)

    await getFile(file)
    console.log(source)

    const query = db.query("select 'world' as name;")

    const template = handlebars.compile(source)
    return c.html(template(query.get()))
})

app.get('/:username', (c) => {
    const { username } = c.req.param()

    
    return c.html(
        html`<!DOCTYPE html>
            <h1>Hello! ${username}!</h1>
        `) 
})

export default app
