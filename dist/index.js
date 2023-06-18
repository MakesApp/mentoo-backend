"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./src/components/users/user.routes"));
const conversation_routes_1 = __importDefault(require("./src/components/conversations/conversation.routes"));
const notifications_routes_1 = __importDefault(require("./src/components/notifications/notifications.routes"));
const place_routes_1 = __importDefault(require("./src/components/places/place.routes"));
require("./src/services/DB/mongoose");
require("./src/services/socket/socket");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const PORT = process.env.EXPRESS_PORT || 9000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    next();
});
app.use("/api", user_routes_1.default);
app.use("/api", place_routes_1.default);
app.use("/api", conversation_routes_1.default);
app.use("/api", notifications_routes_1.default);
app.use('/api', () => {
    console.log('gettt');
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
