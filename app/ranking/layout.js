'use client'
import { RankingContextProvider } from '@/context/rankingsProvider';

export default function RankingLayout({ children }) {
    return (
        <RankingContextProvider>
            {children}
        </RankingContextProvider>
    );
}
