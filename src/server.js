/*Servidor*/
const express = require("express")
const server = express()

//Pegar o banco de dados
const db = require("./database/db")

// configurar pasta publica
server.use(express.static("public"))

//Habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))


/**Utilizando template egine */
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos/rotas da aplicação
//página inicial
server.get("/", (req, res) => {
    return res.render("index.html")
})
//create-point
server.get("/create-point", (req, res) => {
    //req.query: Query, Strings
    //console.log(req.query)
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: O corpo do formulário
    //console.log(req.body)

    db.serialize(() => {
        //criar uma tabela
        db.run(`
            CREATE TABLE IF NOT EXISTS places (
                id  INTEGER PRIMARY KEY AUTOINCREMENT,
                image TEXT,
                name TEXT,
                address TEXT,
                address2 TEXT,
                state TEXT,
                city TEXT,
                items TEXT
            );
        `)

        //inserir dados na tabela
        const query = `
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items
            ) VALUES (?,?,?,?,?,?,?);
        `
        const values = [
            req.body.image,
            req.body.name,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items
        ]

        db.run(query, values, function (err) {
            if (err) {
                console.log(err)
                return res.send("Erro no cadastro!")
            }

            console.log("Cadastrado com sucesso")
            console.log(this)

            return res.render("create-point.html", {saved: true})
        })
    })
})

//search-results
server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length
        console.log(rows)
        // mostrar a página HTML com os dados dp banco de dados
        return res.render("search-results.html", { places: rows, total })
    })

})

/*ligar o servidor*/
server.listen(3000)

