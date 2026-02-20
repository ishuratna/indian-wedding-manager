'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AgentType = 'rsvp' | 'b2b';

interface AgentContextType {
    activeAgent: AgentType;
    setActiveAgent: (agent: AgentType) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
    const [activeAgent, setActiveAgent] = useState<AgentType>('rsvp');

    // Persist agent choice in local storage
    useEffect(() => {
        const savedAgent = localStorage.getItem('activeAgent') as AgentType;
        if (savedAgent && (savedAgent === 'rsvp' || savedAgent === 'b2b')) {
            setActiveAgent(savedAgent);
        }
    }, []);

    const handleSetActiveAgent = (agent: AgentType) => {
        setActiveAgent(agent);
        localStorage.setItem('activeAgent', agent);
    };

    return (
        <AgentContext.Provider value={{ activeAgent, setActiveAgent: handleSetActiveAgent }}>
            {children}
        </AgentContext.Provider>
    );
}

export function useAgent() {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
}
