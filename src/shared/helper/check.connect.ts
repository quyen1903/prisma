// import { PrismaClient } from '@prisma/client'
// import os from "node:os"
// import process from "node:process"
// const period = 5000 

// class CheckConnect {
//     static countConnect(){
//         const numConnection = mongoose.connections.length;
//         console.log(`Number of connection is: ${numConnection}`)
//     }

//     static checkOverload(){
//         setInterval(()=>{
//             const amountConnection = mongoose.connect.length;
//             const amountCores =  os.cpus().length;
//             const memoryUsage = process.memoryUsage().rss;
            
//             const maximumConnection = amountCores*5;
//             if(amountConnection > maximumConnection){
//                 console.log('Connection overload detected!')
//             }
//             console.log(`Active connection: ${amountConnection}`);
//             console.log(`Memory usage:: ${memoryUsage/1024/1024} MB`)
//         },period)
//     }
// }

// export default CheckConnect