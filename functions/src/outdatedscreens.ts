
module.exports = function(app, db) {
    app.delete('/outdatedscreens', (req, res) => {
        const MAXSCREENAGE = 1000 * 60 * 60 * 24 * 1 // 1 day to test
      
        let scrCount = 0
        const screensRef = db().collection("screens");
        screensRef.get().then(ssnap => {
          ssnap.forEach(scr => {
            if(scr.data().refreshTime.toMillis() < (Date.now() - MAXSCREENAGE)){
              scrCount++
            }
          })
        }).catch((error) => {
          console.log('Error getting messages: ', error)
        })
        res.status = 200;
        const result = `Deleted ${scrCount} outedated screens`
        res.send(result);
        res.end();
    });
}