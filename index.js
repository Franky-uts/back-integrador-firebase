const express = require("express")
const cors = require('cors')
const { initializeApp } = require("firebase/app")
const {getFirestore,collection, setDoc, doc, getDoc, getDocs, updateDoc} = require("firebase/firestore")
require ("dotenv/config")

const firebaseConfig = {
  apiKey: "AIzaSyA7oYeDSWWAv9Wm5LQJw4Vy_wqHWJYyEKw",
  authDomain: "pc-doctor-79eb6.firebaseapp.com",
  databaseURL: "https://pc-doctor-79eb6-default-rtdb.firebaseio.com",
  projectId: "pc-doctor-79eb6",
  storageBucket: "pc-doctor-79eb6.appspot.com",
  messagingSenderId: "986732369790",
  appId: "1:986732369790:web:a07b247e310cc01f38052f"
};

//Inicializar BD con firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

//inicializar el servidor
const app = express()
app.use(express.json())

const corsOption = {
  origin: '*',
  optionSuccessStatus: 200
}
app.use(cors(corsOption))

//Rutas :)

app.post('/registro',(req,res) =>{
    const {nombre, usuario, email, contraseña, conContraseña, tipo_usuario} = req.body
    const patron = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const correo_valido = patron.test(email)
    if(nombre.length < 1){
        res.json({
          'alert':'Debes de escribir un nombre'
        })
      }else if(usuario.length < 1){
        res.json({
            'alert':'Debes de escribir un usuario'
          })
      }else if(email.length < 1){
        res.json({
          'alert':'Debes de escribir un correo'
        })
      }else if(correo_valido!=true){
        res.json({
          'alert':'Debes de escribir un correo valido'
        })
      }else if(contraseña.length < 6){
        res.json({
          'alert':'Debes de escribir una contraseña valida'
        })
      }else if(conContraseña.length < 1){
        res.json({
          'alert':'Debes de confirmar una contraseña'
        })
      }else if(contraseña!=conContraseña){
        res.json({
          'alert':'Las contraseñas deben de coincidir'
        })
      }else if(tipo_usuario.length < 1){
        res.json({
          'alert':'Debes de seleccionar tu tipo de usuario'
        })
      }else{
        req.body = {nombre, usuario, email, contraseña, tipo_usuario}
        const users = collection(db, 'users')
        getDoc(doc(users,email)).then(user =>{
          if(user.exists()){
            res.json({
              'alert':'EL correo ya existe aqui'
            })
          }else{
            setDoc(doc(users,email),req.body).then(()=>{
              res.json({
                'alert':'Exito'
              })
            })
          }
        })
      }
})

app.post('/login',(req,res)=>{
  const {email,contraseña}=req.body
  if (!email.length || !contraseña.length){
    return res.json({
      'alert':'no se han recibido los datos correctamente'
    })
  }
  const users = collection(db, 'users')
  getDoc(doc(users,email))
  .then( user=>{
    if (!user.exists()) {
      return res.json({
        'alert': 'correo no registrado'
      })
    }else{
      if(contraseña!=user.data().contraseña){
        res.json({
          'alert':'Contraseña incorrecta'
        })          
      }else{
        res.json({
          'alert':'Exito',
          nombre:user.data().nombre,
          email:user.data().email
        })
      }
    }
  })
})

app.get('/info_usuario', async(req, res) =>{
  const {email} = req.body
  const reference = collection(db,'users')
  let docsSnap = await getDocs(reference)
  let data = []
  docsSnap.forEach(doc=>{
    if(doc.data().email==email)
    data.push(doc.data())
  })
  if(data[0] == null){
    res.json({
      'alert':'No se encontro un usuario'
    })
  }else{
    res.json({
      'alert':'Exito',
      'nombre':data[0].nombre,
      'usuario':data[0].usuario,
      'email':data[0].email,
      'tipo_usuario':data[0].tipo_usuario,
      'contraseña':data[0].contraseña
    })
  }
})

app.post('/editar_usuario',(req, res) =>{
  const {nombre, usuario, email, contraseña} = req.body
if(nombre.length < 1){
  res.json({
    'alert':'Debes de escribir un nombre'
  })
}else if(usuario.length < 1){
    res.json({
      'alert':'Debes de escribir un usuario'
    })
}else if(contraseña.length < 6){
  res.json  ({
    'alert':'Debes de escribir un contraseña valida'
  })
}else{
  const users = collection(db, 'users')
  setDoc(doc(users,email),req.body).then(()=>{
    res.json({
      'alert':'Exito'
    })
  })
}
})

app.post('/prueba',(req,res)=>{
  const {cosa1,cosa2,cosa3}=req.body
  console.log(req.body)
  const users = collection(db, 'users')
  setDoc(doc(users,cosa2),req.body).then(()=>{
    res.json({
      'alert':'Exito'
    })
  })
})

const PORT = process.env.PORT || 19000
app.listen(PORT,() =>{
    console.log(`Escuchando en el puerto: ${PORT}`)
})

