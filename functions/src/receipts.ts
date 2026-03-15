module.exports = function (app, db) {
  app.post('/receipts', (req, res) => {
    const msgPath = req.body.messagePath
    console.log('Received receipt for ', msgPath)
    const msgRef = db().doc(msgPath)
    msgRef
      .update('receipt', 'true')
      .then(() => {
        console.log('Receipt saved for ', msgPath)
        res.status(303).redirect('/')
      })
      .catch(error => {
        console.log('Receipt failed: ', error)
      })

    // Delete url messages
    msgRef.get().then(doc => {
      if (doc.exists) {
        const message = doc.data().message
        if (message.startsWith('https:')) {
          msgRef
            .delete()
            .then(() => {
              console.log('Successfully deleted url message after receipt')
            })
            .catch(error => {
              console.log('Error deleting url message: ', error)
            })
        }
      }
    })
  })
}
