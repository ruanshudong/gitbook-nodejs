"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const hostname = process.env.HTTP_IP || "0.0.0.0";
const port = process.env.HTTP_PORT || 6080;
app_1.initialize().then(() => {
    app_1.app.listen(port, hostname, () => {
        console.log(`server listening at ${hostname}:${port}`);
    });
});
