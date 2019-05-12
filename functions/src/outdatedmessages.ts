module.exports = function (app, db) {
    const outdated = require('./deleteoutdated')
    app.delete('/outdatedmessages', async (req, res) => {

        const screensRef = db().collection("screens");
        screensRef.get().then(ssnap => {
            ssnap.forEach(scr => {
                console.log('Checking screen ', scr.data().name)
                outdated.deleteOutdatedMessages(db, scr.id)
            })
        }).catch(error => {
            console.log('Error getting screens: ', error)
        })

        const result = 'Done starting deletion of outdated messages'
        console.log(result)
        res.status = 200;
        res.send(result);
        res.end();
    })
}
