import { Routes,Route } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import Notifications from "./pages/Notifications";
import { Toaster } from "react-hot-toast";
import {useQuery} from "@tanstack/react-query";
const App=()=>{
   const {data,isLoading,error,}=useQuery({
    queryKey:["user"],
    queryFn:async()=>{
        const res=await fetch("http://localhost:8000/api/auth/me",{
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.json();
    },
   });
   return(
     <div className="h-screen" data-theme="night">
        <Routes>
           <Route path="/" element={<HomePage/>} />
           <Route path="/signup" element={<SignUpPage/>} />
           <Route path="/login" element={<LoginPage/>} />
           <Route path="/onboarding" element={<OnboardingPage/>} />
           <Route path="/chat" element={<ChatPage/>} />
           <Route path="/call" element={<CallPage/>} />
           <Route path="/notifications" element={<Notifications/>} />
        </Routes>
        <Toaster/>
     </div>
   )
};

export default App;