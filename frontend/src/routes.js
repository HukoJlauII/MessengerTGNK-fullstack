import {ChatPage} from "./pages/ChatPage";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import {ErrorPage} from "./pages/ErrorPage";
import {Contact} from "./pages/Contact";

export const authRoutes = [
    {
        path: '*',
        Component: ErrorPage
    },
    {
        path: '/',
        Component: ChatPage
    },
    {
        path: '/home',
        Component: ChatPage
    },
    {
        path: '/profile',
        Component: UserProfile
    },
    {
        path: '/contact',
        Component: Contact
    }
]

export const publicRoutes = [
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/register',
        Component: Register
    },
    {
        path: '*',
        Component: Login
    }
]
