const express = require('express');
const swagger = require('swagger-ui-express');
const app = express();
const PORT = 8080;

app.use(express.json())

require('./src/router/user.router')(app);
require('./src/router/link.account.router')(app);
require('./src/router/groupe.router')(app);
require('./src/router/personality.router')(app);
require('./src/router/playlist.router')(app);
app.use('/api-docs', swagger.serve, swagger.setup(require('./swagger/swagger-doc.json')))

app.listen(PORT, () => console.log(`Serveur disponible : http://localhost:${PORT}`));
