
const config = require('./config.json')

const { Pool } = require('pg')
const { Client } = require('discord.js')

const client = new Client()
const pool = new Pool(config.database)

pool.connect().then(res => console.log('Ready\tDatabase'))
client.once('ready', () => console.log('Ready\tDiscord.js'))
client.login(config.token)

client.on('message', async message => {
    
    if(message.system || message.author.bot) return

    // injecter l'user si nouveau

    await pool.query(`
        INSERT INTO "user" ( id )
        VALUES ( $1 )
        ON CONFLICT ( id )
        DO NOTHING
    `, [ message.author.id ])

    // choper le prochain ID des sentences

    let res = await pool.query(`SELECT COUNT(id) AS "count" FROM "sentence"`)
    const sentence_id = res.rows[0].count + 1

    // injecter la phrase de l'user

    await pool.query(`
        INSERT INTO "sentence" ( id, user_id, receiver_id, content )
        VALUES ( $1, $2, $3, $4 )
    `, [ sentence_id, message.author.id, client.user.id, message.content ])

    // récuérer la dernière phrase du bot

    res = await pool.query(`
        SELECT * FROM "sentence" 
        WHERE user_id = $1
        AND receiver_id = $2
        ORDER BY id ASC
        LIMIT 1
    `, [ client.user.id, message.author.id ])

    const last_bot_sentence = res.rows[0]

    // préparer la réponse

    let new_sentence = {}

    if(last_bot_sentence){

        // faire en fonction
    
    }else{

        // choisir un début de conversation parmis 
        // tous les débuts de conversations analysés

    }

    // l'injecter en DB

    // injecter le lien lexical

    // l'envoyer sur Discord

})