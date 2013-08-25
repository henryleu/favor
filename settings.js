module.exports = {
    id: 'fv',
    name: 'favor',
    creator: '番茄实验室',
    secretKey: 'quick',
    mongo:{
        db: 'favor',
        host: 'localhost',
        port: 27017
    },
    redis:{
        host: 'localhost',
        port: 6379
    },
    session: {
        storeType: 'redis',
        expires: 60 // minutes
    },
    logging: {
        reloadSecs: 0, //INFO: set 0 could let nodeunit tests which use log4js exit properly
        level: 'DEBUG'
    },
    resources: {
        appName: '爱萌范儿',
        appTitle: '爱萌范儿 -- 发现我的萌，秀出我的范儿',
        appCreator: '番茄实验室',
        errorUnknown: '不好意思，系统出了点小问题'
    }
}
;
