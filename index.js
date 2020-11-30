const express = require('express'); 
const db = require('./data/db'); 


const app = express(); 
app.use(express.json()); 



// Import Routes 
const UserRoutes = require('./routes/user'); 


// user Router 
app.use('/api', UserRoutes); 






const PORT = 5000; 
app.listen(PORT, () => {
    console.log('server is up on port ' + PORT); 
})