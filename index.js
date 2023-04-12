const express = require("express")
const app = express()
const cors = require('cors')
//const { initializeApp } = require("firebase/app")
//const { getDatabase } = require("firebase/database")
const admin = require('firebase-admin')
//const serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://pruebita-dfb8f-default-rtdb.firebaseio.com'
})

const db = admin.database();

require ("dotenv/config")

/*const firebaseConfig = {
  apiKey: "AIzaSyD894EcKYiEAANr1OSqBzyxbl8Gqc-ZJ_A",
  authDomain: "pruebita-dfb8f.firebaseapp.com",
  databaseURL: "https://pruebita-dfb8f-default-rtdb.firebaseio.com",
  projectId: "pruebita-dfb8f",
  storageBucket: "pruebita-dfb8f.appspot.com",
  messagingSenderId: "901837454214",
  appId: "1:901837454214:web:6999288b2551eb70cdca07"
  }
const firebase = initializeApp(firebaseConfig)*/

app.use(express.json())

const corsOption = {
    origin: '*',
    optionSuccessStatus: 200
  }
app.use(cors(corsOption))

app.post('/registro',(req,res) =>{
    const {nombre, usuario, email, contraseña, tipo_usuario} = req.body
    if(nombre.length < 3){
        res.json({
          'alert':'El nombre debe ser mayor a 3 caracteres'
        })
      }else if(usuario.length < 3){
        res.json({
            'alert':'El usuario debe ser mayor a 3 caracteres'
          })
      }
})

app.post('/prueba',(req,res)=>{
  const {cosa1,cosa2,cosa3}=req.body
  console.log(req.body)
  //const db = getDatabase()
  const nuevoUsuario = {
    dato1: req.body.cosa1,
    dato2: req.body.cosa2,
    dato3: req.body.cosa3
  }
  const ref = db.ref('usuarios').push(nuevoUsuario) 

  /*const usersRef = ref.child('users')
  usersRef.child(req.body.dato1).set({
    dato1: req.body.dato1,
    dato2: req.body.dato2,
    dato3: req.body.dato3
  })*/
  /*const { getDatabase, ref, set } = require("firebase/database")
  function writeUserData() {
    const db = getDatabase();
    set(ref(db, 'users/' + req.body.cosa1), {
      dato1: req.body.cosa1,
      dato2: req.body.cosa2,
      dato3 : req.body.cosa3
    })
  }*/
  /*database.ref("hola").set(req,function(error){
    if(error){
      console.log('Error'+error)
    }else{
      console.log('ok :)')
    }
  })*/
  res.json({
    'alert':'Sucess '//+dato1+dato2+dato3
  })
})

const PORT = process.env.PORT || 19000
app.listen(PORT,() =>{
    console.log(`Escuchando en el puerto: ${PORT}`)
})

