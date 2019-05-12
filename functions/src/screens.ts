module.exports = function(app, db) {

    // Get the screens the user has access to
    app.get('/screens', (req, res) => {
        const screensRef = db().collection("screens");
        screensRef.where('users.' + req.user.email.replace(/\./g, '+'), '>=', '').get()
        .then(snapshot => {
            const result = [];
            snapshot.forEach(doc => {
            result.push({
                name: doc.data().name,
                key: doc.id
            });
            })
            res.status = 200;
            res.send(JSON.stringify(result));
            res.end();
        }).catch((error) => {
            console.log('Error: ', error);
        });
    });

    // Save screen
    app.post('/screens', (req, res) => {
        const screen = {
        name: "" + req.body.name,
        users: req.body.users,
        refreshTime: new Date(),
        }
    
        const secret = req.body.secret;
        const ref = db().collection('screens').doc(secret);
        ref.set(screen).then(() => {
        null
        res.redirect(303, screen.toString());
        }).catch((error) => {
        console.log('Screen save failed: ', error);
        })
    });
}

