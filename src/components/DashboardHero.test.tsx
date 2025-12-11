import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DashboardHero } from './DashboardHero';
import flashcardReducer from '../store/flashcardSlice';
import { BrowserRouter } from 'react-router-dom';

// Create a custom render function that includes providers
const renderWithProviders = (
    ui: React.ReactElement,
    {
        preloadedState = {},
        store = configureStore({ reducer: { flashcards: flashcardReducer }, preloadedState }),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        return (
            <Provider store={store}>
                <BrowserRouter>{children}</BrowserRouter>
            </Provider>
        );
    };
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('DashboardHero', () => {
    it('renders "My Flashcards" card with correct count', () => {
        const preloadedState = {
            flashcards: {
                flashcards: [
                    { id: '1', title: 'N1', content: 'C1', createdAt: 1 },
                    { id: '2', title: 'N2', content: 'C2', createdAt: 2 }
                ]
            }
        };

        renderWithProviders(<DashboardHero />, { preloadedState });

        expect(screen.getByText('My Flashcards')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Count
        expect(screen.getByText('cards created')).toBeInTheDocument();
    });

    it('renders "Coming Soon" card', () => {
        renderWithProviders(<DashboardHero />);
        expect(screen.getByText('Coming Soon')).toBeInTheDocument();
        expect(screen.getByText('Smart Quiz')).toBeInTheDocument();
    });
});
