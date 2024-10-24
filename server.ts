import app from './src/app'
const PORT = process.env.PORT || 3056

const server = app.listen(PORT,()=>{
    console.log(`CRUDE start with port ${PORT}`)
})
