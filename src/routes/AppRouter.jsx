import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import IntroPage from '../pages/IntroPage';
import CountdownPage from '../pages/CountdownPage';
import MemoriesPage from '../pages/MemoriesPage';
import BirthdayMessagePage from '../pages/BirthdayMessagePage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROUTE_PATHS } from './routePaths';

export default function AppRouter({
  revealState,
  messagesState,
}) {
  return (
    <Routes>
      <Route
        path={ROUTE_PATHS.HOME}
        element={
          <HomePage
            revealState={revealState}
            messagesState={messagesState}
          />
        }
      />
      <Route path={ROUTE_PATHS.INTRO} element={<IntroPage />} />
      <Route
        path={ROUTE_PATHS.COUNTDOWN}
        element={<CountdownPage revealState={revealState} />}
      />
      <Route
        path={ROUTE_PATHS.GALLERY}
        element={
          <MemoriesPage
            revealState={revealState}
            messagesState={messagesState}
          />
        }
      />
      <Route
        path={ROUTE_PATHS.MESSAGE}
        element={
          <BirthdayMessagePage
            revealState={revealState}
            messagesState={messagesState}
          />
        }
      />
      <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
