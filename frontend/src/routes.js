import {ChatPage} from "./pages/ChatPage";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register";
import UserProfile from "./pages/UserProfile";

export const authRoutes = [

    {
        path: '/home',
        Component: ChatPage
    },
    {
        path: '/profile',
        Component: UserProfile
    },
]

export const publicRoutes = [
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/register',
        Component: Register
    }
]
