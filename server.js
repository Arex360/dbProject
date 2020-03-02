const mysql = require('mysql')
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
const soc = require('socket.io')
const socketIO = soc(server)
var name = ''
var pass = ''
var err = false
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'arex',
	password: '123',
	database: 'Project'
})
connection.connect(err=>{
	if(err) throw new Error()
	console.log('database connected')
})
socketIO.on("connection",Service=>{
	Service.on("createUserName", getName=>{
         name = getName
         var query = `insert into Users (name) values ${name}`
         try {
         	connection.query(query, (err,result)=>{
         	if(err) throw new Error()
         	console.log('name added')
         })
        } catch(e){
           err = true
        }
	})
	Service.on("createUserName", getPass=>{
         pass = getPass
         var query = `insert into Users (password) values ${pass}`
         connection.query(query,(err,result)=>{
         	if(err) throw new Error()
         	console.log('password added')
         })
	})
	Service.on("registered", result=>{
		if(err)
		     Service.broadcast.emit("Status","Account failed to be created")
	    else
	    	Service.broadcast.emit("Status","Account created")
	})
})
server.listen(PORT,()=>{
	console.log(`Server started at port ${PORT}`)
})
