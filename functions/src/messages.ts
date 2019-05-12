

module.exports = function (app, db) {
  const outdated = require('./deleteoutdated')
  app.post('/screens/:id/messages', (req, res) => {
    const id = req.params.id;
    const screenRef = db().collection('screens').doc(id);
    outdated.deleteOutdatedMessages(db, id)
    // deleteOutdatedMessages(db, id)
    screenRef.get().then(doc => {
      if (doc.exists) {
        const users = doc.get('users')
        const name = users[req.user.email.replace(/\./g, '+')]

        if (name) {
          const message = {
            message: "" + req.body.message,
            sentBy: name,
            sentByEmail: req.user.email,
            sentTime: new Date(),
            validMinutes: req.body.lifetime
          }

          const msgRef = db().collection('screens/' + id + '/messages');
          msgRef.add(message).then((newRef) => {
            newRef.get().then((newMsg) => {
              console.log('Saved msg id(', newMsg.id, '): ', newMsg.data())
              const result = newMsg.data()
              result.id = newMsg.id
              console.log('Result: ', result)

              // Returner 201 med new message, inkludert id

              res.status(201).send(result)
              // res.redirect(303, newMsg.data());
            }).catch((error) => {
              console.log('Error getting saved message: ', error)
            })
          }).catch((error) => {
            console.log('Message set response: ', error);
          })
        }
      } else {
        console.log('Screen not found')
      }
    }).catch((error) => {
      console.log('Get users response: ', error);
    })
  });


  app.delete('/screens/:sid/messages/:mid', (req, res) => {
    const sid = req.params.sid;
    const mid = req.params.mid;

    const ref = db().collection('screens').doc(sid).collection('messages').doc(mid);
    return ref.delete().then(() => {
      res.status(204).send()
    }).catch((error) => {
      console.log('Delete error: ', error)
    })
  });

}