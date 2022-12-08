import express from 'express';
import { config } from "dotenv";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
config();
const app = express();
const port = 3000 || process.env.PORT
app.get('/', (req, res) => res.send('Hello World!'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function main() {
    await prisma.$connect()

    app.get('/id', async (req, res) => {
        let idRoom;
        idRoom = Math.floor(1000000 + Math.random() * 9000000);
        console.log('New room id: ' + idRoom)
        await prisma.idRoom.create({ data: { idRoom } })
        res.json({ idRoom })
    })

    app.post('/join', async (req, res) => { 
        const room = await prisma.idRoom.findUnique({ where: { idRoom: req.body.room } })
        
        if (room) {
            console.log('Room found')
            const users = room.users.push(req.body.name)
            console.log(users)
            const roomAfter = await prisma.idRoom.update({ where: { idRoom: req.body.room }, data: { users } })
            res.json({ roomAfter })
        } else {
            console.log('Room not found')
            res.json({ room: null })
        }

    })   

}

main()
    .then(async () => {
        await prisma.$disconnect();
    }).catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

app.listen(port, () => console.log(`Kishu's backend is listening on port ${port}!`));