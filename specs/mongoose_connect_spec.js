const mongoose = require('mongoose');

describe('connection', () => {
    it('successfully', async() => {
        await mongoose.connect('mongodb://localhost/links', { 'useNewUrlParser': true });

        let db = mongoose.connection;
        db.on('open', () => {
            console.log('connection established');
        });

        db.on('error', (err) => {
            console.log(`error: ${err}`);
        });
        // let db = mongoose.connection;
        //
        // db.on('open', () => {
        //     console.log('connected to db successfully');
        // });
        // db.on('error', (err) => {
        //     console.log(`DB:error ${err}`);
        // });

    });
});
