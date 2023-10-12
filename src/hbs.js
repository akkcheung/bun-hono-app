const hbs = require('handlebars')
const fs = require('fs') // node fs

const registerHelpers = () => {

    hbs.registerHelper('isTrue', function(value){
        return value !== 0
    })

    hbs.registerHelper('eq', function(arg1, arg2){
        return (arg1 === arg2)
    })
}

const registerPartials = () => {

    const partialsDir = __dirname + '/views/partials'
    const filenames = fs.readdirSync(partialsDir)

    filenames.forEach(function (filename) {

        let matches = /^([^.]+).htm$/.exec(filename);
        if (!matches) {
            return;
        }
        let name = matches[1];
        // console.log(name)

        let template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
        hbs.registerPartial(name, template);
    });

    console.log("register partials done")
}

async function renderTemplate(path, data){

    const file = Bun.file(path)

    const text = await file.text()
    const template = hbs.compile(text)

    return template(data)
}


export {registerHelpers, registerPartials, renderTemplate}
