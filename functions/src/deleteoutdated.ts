module.exports = {

    deleteOutdatedMessages: function (db, screenId) {
        const msgRef = db().collection("screens/" + screenId + "/messages");
        msgRef.get().then(msnap => {
            msnap.forEach(msg => {
                const validTo = new Date(msg.data().sentTime.toMillis() + msg.data().validMinutes * 60000);
                if (validTo.getTime() < Date.now()) {
                    msg.ref.delete().then(
                        null
                    ).catch(error => {
                        console.log('Error deleting message: ', error)
                    })
                }
            })
        }).catch(error => {
            console.log('Error reading messages: ', error)
        })
    }

}

