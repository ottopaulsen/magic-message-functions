module.exports = function(app, db) {
    app.post('/receipts', (req, res) => {
        const msgPath = req.body.messagePath
        console.log('Received receipt for ', msgPath)
        const msgRef = db().doc(msgPath);
        msgRef.update('receipt', 'true').then(() => {
          console.log('Receipt saved for ', msgPath)
          res.redirect(303, '');
        }).catch((error) => {
          console.log('Receipt failed: ', error);
        })
    });
            
}