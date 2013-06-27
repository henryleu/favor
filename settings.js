module.exports = {
    id: 'fv',
    name: 'favor',
    creator: '番茄实验室',
    cookieSecret: 'quick',
    mongo:{
        db: 'favor',
        host: 'localhost',
        port: 27017
    },
    redis:{
        host: 'localhost',
        port: 6379
    },
    logging: {
        reloadSecs: 300,
        level: 'DEBUG'
    },
    session: {
        storeType: 'redis',
        expires: 60 // minutes
    }

}
;
