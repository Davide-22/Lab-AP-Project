#!/usr/bin/env node

const amqp = require('amqplib')

amqp.connect('amqp://rabbitmq')
    .then(connection => {
        connection.createChannel()
            .then(channel => {
                var exchange = 'logs'
                channel.assertExchange(exchange, 'fanout', {
                    durable: false
                }).then(
                    channel.assertQueue('', {
                        exclusive: true
                    }).then(q => {
                        var today = new Date()
                        var h = today.getHours()
                        var m = today.getMinutes()
                        var s = today.getSeconds()
                        console.log('[' + h + ":" + m + ":" + s + ']' + " Starting logger session", q.queue)
                        channel.bindQueue(q.queue, exchange, '')
                        channel.consume(q.queue, function (msg) {
                            if (msg.content) {
                                console.log("%s", msg.content.toString())
                            }
                        }, {
                            noAck: true
                        })
                    })
                )
            })
    })