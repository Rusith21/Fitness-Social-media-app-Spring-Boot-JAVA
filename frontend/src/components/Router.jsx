import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddMealPlan from './meal plan/AddMealPlan';
import UpdateMealPlan from './meal plan/UpdateMealPlan';
import AddWorkoutPlan from './workout plan/AddWorkoutPlan';
import UpdateWorkoutPlan from './workout plan/UpdateWorkoutPlan';
import SignIn from './user/SignIn';
import SignUp from './user/SignUp';
import Home from './Home';
import { UserProvider } from './user/UserContext';
import GetUserMealPlans from './meal plan/GetUserMealPlans';
import GetUserWorkoutPlans from './workout plan/GetUserWorkoutPlans';
import Layout from './Layout';
import UserProfile from './user/UserProfile';
import ViewAllWorkoutStatus from './workout status/ViewAllWorkoutStatus';
import AddWorkoutStatus from './workout status/AddWorkoutStatus';
import UpdateWorkoutStatus from './workout status/UpdateWorkoutStatus';
import GetUserWorkoutStats from './workout status/GetUserWorkoutStats';

function AppRouter() {
    
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/create-meal-plan" element={<AddMealPlan />} />
                    <Route path="/edit-meal-plan/:id" element={<UpdateMealPlan />} />
                    <Route path="/add-workout-plan" element={<AddWorkoutPlan />} />
                    <Route path="/update-workout-plan/:id" element={<UpdateWorkoutPlan />} />
                    <Route path="/user-meal-plans/:userId" element={<GetUserMealPlans />} />
                    <Route path="/user-workout-plans/:userId" element={<GetUserWorkoutPlans />} />
                    <Route path="/user-profile/:userId" element={<UserProfile />} />
                    <Route path="/view-all-workout-status" element={<ViewAllWorkoutStatus />} />
                    <Route path="/add-workout-status" element={<AddWorkoutStatus />} />
                    <Route path="/update-workout-status/:id" element={<UpdateWorkoutStatus />} />
                    <Route path="/user-workout-status/:userId" element={<GetUserWorkoutStats />} />
          
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default AppRouter;