import React from "react";
import { Route, Routes } from "react-router-dom";
import TalentsPulseError404 from "../composants/TalentsPulseError404";
import {
  END_POINT_DASHBOARD,
  END_POINT_DASHBOARD_CANDIDATE_ABOUT,
  END_POINT_DASHBOARD_CANDIDATE_DETAILED_PROJECTS,
  END_POINT_DASHBOARD_CANDIDATE_FORMATIONS,
  END_POINT_DASHBOARD_CANDIDATE_LINGUISTICS,
  END_POINT_DASHBOARD_CANDIDATE_PROJECTS,
  END_POINT_DASHBOARD_CANDIDATE_SKILLS,
  END_POINT_DASHBOARD_CANDIDATE_TECHNICAL_ACHIEVEMENTS,
  END_POINT_DASHBOARD_CHANGE_PASSWORD,
  END_POINT_DASHBOARD_CREATE_DCT,
  END_POINT_DASHBOARD_DCTS,
  END_POINT_DASHBOARD_EDIT_DCT,
  END_POINT_DASHBOARD_EXPERTISES,
  END_POINT_DASHBOARD_PROFILE,
  END_POINT_DASHBOARD_SECTORS,
  END_POINT_DASHBOARD_STEPS_DCT,
  END_POINT_DASHBOARD_USERS,
  END_POINT_DASHBOARD_VIEW_DCT,
  END_POINT_FORGOT_PASSWORD,
  END_POINT_HOME,
  END_POINT_LOGIN,
  END_POINT_MY_DCT,
  END_POINT_PROFILE_COMPLETED,
  END_POINT_REGISTER,
} from "./end-points";
import LoginScreen from "../pages/auth/LoginScreen";
import RegisterScreen from "../pages/auth/RegisterScreen";
import DashboardScreen from "../pages/dashboard/DashboardScreen";
import UsersScreen from "../pages/dashboard/user/UsersScreen";
import DctsScreen from "../pages/dashboard/user/DctsScreen";
import ForgotPasswordScreen from "../pages/auth/ForgotPasswordScreen";
import ProfileScreen from "../pages/inc/ProfileScreen";
import ChangePasswordScreen from "../pages/inc/ChangePasswordScreen";
import SectorsScreen from "../pages/dashboard/user/SectorsScreen";
import ExpertisesScreen from "../pages/dashboard/user/ExpertisesScreen";
import ProfileCompletedScreen from "../pages/auth/inc/ProfileCompletedScreen";
import ViewDctScreen from "../pages/dashboard/user/inc/ViewDctScreen";
import AboutScreen from "../pages/dashboard/candidate/AboutScreen";
import SkillsScreen from "../pages/dashboard/candidate/SkillsScreen";
import DashboardCandidateScreen from "../pages/dashboard/candidate/DashboardCandidateScreen";
import ProjectsScreen from "../pages/dashboard/candidate/ProjectsScreen";
import FormationsScreen from "../pages/dashboard/candidate/FormationsScreen";
import TechnicalAchievementsScreen from "../pages/dashboard/candidate/TechnicalAchievementsScreen";
import LinguisticsScreen from "../pages/dashboard/candidate/LinguisticsScreen";
import DetailedProjectsScreen from "../pages/dashboard/candidate/DetailedProjectsScreen";
import CandidateRoute from "./inc/CandidateRoute";
import PrivateRoute from "./inc/PrivateRoute";
import CreateDctScreen from "../pages/dashboard/dct/CreateDctScreen";
import StepsDctScreen from "../pages/dashboard/dct/StepsDctScreen";
import EditDctScreen from "../pages/dashboard/user/inc/EditDctScreen";

const TalentsPulseRouters = () => {
  return (
    <Routes>
      <Route path={END_POINT_HOME} element={<DashboardScreen />} />
      {/* Auth Routing */}
      <Route path={END_POINT_LOGIN} element={<LoginScreen />} />
      <Route path={END_POINT_REGISTER} element={<RegisterScreen />} />
      <Route
        path={END_POINT_FORGOT_PASSWORD}
        element={<ForgotPasswordScreen />}
      />
      <Route
        path={END_POINT_PROFILE_COMPLETED}
        element={<ProfileCompletedScreen />}
      />
      <Route
        path={END_POINT_DASHBOARD_STEPS_DCT}
        element={
          <PrivateRoute>
            <StepsDctScreen />
          </PrivateRoute>
        }
      />
      <Route path={END_POINT_DASHBOARD} element={<DashboardScreen />} />
      {/* User Routing */}
      <Route
        path={END_POINT_DASHBOARD_CREATE_DCT}
        element={
          <PrivateRoute>
            <CreateDctScreen />
          </PrivateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_USERS}
        element={
          <PrivateRoute>
            <UsersScreen />
          </PrivateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_DCTS}
        element={
          <PrivateRoute>
            <DctsScreen />
          </PrivateRoute>
        }
      />
      <Route
        path={`${END_POINT_DASHBOARD_DCTS}/${":completed"}`}
        element={
          <PrivateRoute>
            <DctsScreen />
          </PrivateRoute>
        }
      />
      <Route
        path={`${END_POINT_DASHBOARD_VIEW_DCT}/${":_id"}`}
        element={
          <PrivateRoute>
            <ViewDctScreen />
          </PrivateRoute>
        }
      />
      <Route
        path={`${END_POINT_DASHBOARD_EDIT_DCT}/${":_id"}`}
        element={
          <PrivateRoute>
            <EditDctScreen />
          </PrivateRoute>
        }
      />
      <Route path={END_POINT_DASHBOARD_PROFILE} element={<ProfileScreen />} />
      <Route
        path={END_POINT_DASHBOARD_CHANGE_PASSWORD}
        element={<ChangePasswordScreen />}
      />
      <Route
        path={END_POINT_DASHBOARD_SECTORS}
        element={
          <PrivateRoute>
            <SectorsScreen />
          </PrivateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_EXPERTISES}
        element={
          <PrivateRoute>
            <ExpertisesScreen />
          </PrivateRoute>
        }
      />
      {/* Candidate Routing */}
      <Route
        path={END_POINT_MY_DCT}
        element={
          <CandidateRoute>
            <DashboardCandidateScreen />
          </CandidateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_CANDIDATE_ABOUT}
        element={
          <CandidateRoute>
            <AboutScreen />
          </CandidateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_CANDIDATE_SKILLS}
        element={
          <CandidateRoute>
            <SkillsScreen />
          </CandidateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_CANDIDATE_PROJECTS}
        element={
          <CandidateRoute>
            <ProjectsScreen />
          </CandidateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_CANDIDATE_FORMATIONS}
        element={
          <CandidateRoute>
            <FormationsScreen />
          </CandidateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_CANDIDATE_TECHNICAL_ACHIEVEMENTS}
        element={
          <CandidateRoute>
            <TechnicalAchievementsScreen />
          </CandidateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_CANDIDATE_LINGUISTICS}
        element={
          <CandidateRoute>
            <LinguisticsScreen />
          </CandidateRoute>
        }
      />
      <Route
        path={END_POINT_DASHBOARD_CANDIDATE_DETAILED_PROJECTS}
        element={
          <CandidateRoute>
            <DetailedProjectsScreen />
          </CandidateRoute>
        }
      />
      {/* Error Routing */}
      <Route path="*" element={<TalentsPulseError404 />} />
    </Routes>
  );
};

export default TalentsPulseRouters;
