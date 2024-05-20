const io = require('socket.io')(3000, {
    cors: {
        origin: 'https://5173-idx-google-docs-clone-1716226088741.cluster-t23zgfo255e32uuvburngnfnn4.cloudworkstations.dev/',
        methods: ['GET', 'POST']
    }
})

io.on("connection", socket => {
    console.log('Connected')
})z