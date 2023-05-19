"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./src/components/users/user.routes"));
const conversation_routes_1 = __importDefault(require("./src/components/conversations/conversation.routes"));
const notifications_routes_1 = __importDefault(require("./src/components/notifications/notifications.routes"));
require("./src/services/DB/mongoose");
require("./src/services/socket/socket");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 9000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", user_routes_1.default);
app.use("/api", conversation_routes_1.default);
app.use("/api", notifications_routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
